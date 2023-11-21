function AppModel({ waivioDb }) {
  const App = waivioDb.models.apps;

  const findOne = async ({ filter, projection, options }) => {
    try {
      const result = await App.findOne(filter, projection, options);
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const find = async ({ filter, projection, options }) => {
    try {
      const result = await App.find(filter, projection, options).lean();
      return { result };
    } catch (error) {
      return { error };
    }
  };

  const findOneByHost = async ({ host }) => {
    const { result } = await findOne({
      filter: { host },
    });

    return result;
  };

  const findSitesHosts = async () => {
    const { result } = await find({
      filter: { inherited: true, canBeExtended: false },
      projection: { host: 1 },
    });
    if (!result.length) return [];
    return result.map((el) => el.host);
  };

  const getAppAddsByHost = async (host) => {
    const { result } = await findOne({ filter: { host } });

    return result?.adSense?.txtFile ?? '';
  };

  return {
    findOneByHost,
    findSitesHosts,
    getAppAddsByHost,
  };
}

export default AppModel;
