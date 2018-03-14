//@flow

type Config = string | {[string] : boolean} | Array<Config>;

const expand = (toExpand: string, prefix: string): string => {
  return toExpand.startsWith("&")
    ? toExpand.replace("&", prefix)
    : toExpand;
}

const parseConfig = (config: Config, name: string) : string => {
  if (!config) {
    return "";
  }
  if (typeof config === "string" || config instanceof String) {
    return expand(config, name);
  }
  if (Array.isArray(config)) {
    return config.filter(item => item).map(item => expand(item, name)).join(" ");
  }
  return Object.keys(config)
    .reduce((items, item) => {
      return config[item] ? [...items, expand(item, name)] : items;
    }, [])
    .join(" ");
}


export default (name: string): any | (string => string) => {
  return (...config?: Config) => {
    if (!config || config.length === 0) {
      return name;
    }
    return config.length > 1 ? config.map(arg => parseConfig(arg, name)).join(' ') : parseConfig(config[0], name);
  };
};
