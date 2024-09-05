const REMOVE_OBJ_STATUSES = [
  'relisted',
  'unavailable',
  'nsfw',
];

const OBJECT_TYPES_SITEMAP = [
  'book',
  'product',
  'list',
  'business',
  'page',
  'restaurant',
  'recipe',
  'link',
  'person',
  'map',
  'widget',
];

function WobjectModel({ waivioDb }) {
  const Wobject = waivioDb.models.wobject;

  const find = async ({ filter, projection, options }) => {
    try {
      const result = await Wobject.find(filter, projection, options).lean();
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await Wobject.findOne(filter, projection, options).lean();
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findOneByPermlink = async ({ authorPermlink }) => {
    const { result } = await findOne({ filter: { author_permlink: authorPermlink } });

    return result;
  };

  const siteObjectsFilterDining = ({ app }) => {
    const authorities = app?.authority ?? [];
    const orMapCond = [], orTagsCond = [];
    if (app.mapCoordinates.length) {
      app.mapCoordinates.forEach((points) => {
        orMapCond.push({
          map: {
            $geoWithin: {
              $box: [points.bottomPoint, points.topPoint],
            },
          },
        });
      });
    }
    if (app.object_filters && Object.keys(app.object_filters).length) {
      for (const type of Object.keys(app.object_filters)) {
        const typesCond = [];
        for (const category of Object.keys(app.object_filters[type])) {
          if (app.object_filters[type][category].length) {
            typesCond.push({
              fields: {
                $elemMatch: {
                  name: 'categoryItem',
                  body: { $in: app.object_filters[type][category] },
                  tagCategory: category,
                },
              },
            });
          }
        }
        if (typesCond.length)orTagsCond.push({ $and: [{ object_type: type }, { $or: typesCond }] });
      }
    }
    const condition = {
      $and: [{
        $or: [{
          $expr: {
            $gt: [
              { $size: { $setIntersection: ['$authority.ownership', authorities] } },
              0,
            ],
          },
        }, {
          $expr: {
            $gt: [
              { $size: { $setIntersection: ['$authority.administrative', authorities] } },
              0,
            ],
          },
        }],
      }],
      object_type: { $in: app.supported_object_types },
    };
    if (orMapCond.length)condition.$and[0].$or.push(...orMapCond);
    if (orTagsCond.length) condition.$and.push({ $or: orTagsCond });

    return condition;
  };

  const siteObjectsFilterSocial = ({ app }) => {
    const userShop = app?.configuration?.shopSettings?.type === 'user';

    const authorities = [...app.authority];
    userShop
      ? authorities.push(app?.configuration?.shopSettings?.value)
      : authorities.push(app.owner);

    return {
      'authority.administrative': { $in: authorities },
      'status.title': { $nin: REMOVE_OBJ_STATUSES },
      object_type: { $in: OBJECT_TYPES_SITEMAP },
    };
  };

  const findSiteObjects = async ({ social, app }) => {
    const filter = social
      ? siteObjectsFilterSocial({ app })
      : siteObjectsFilterDining({ app });

    const { result } = await find({
      filter,
      projection: { author_permlink: 1, object_type: 1 },
    });
    return result;
  };

  const findListAndPageByLinks = async ({ links }) => {
    const { result } = await find({
      filter: {
        author_permlink: { $in: links },
        object_type: { $in: ['list', 'page'] },
      },
      projection: { author_permlink: 1, object_type: 1 },
    });
    return result;
  };

  return {
    findSiteObjects,
    findOneByPermlink,
    findListAndPageByLinks,
  };
}

export default WobjectModel;
