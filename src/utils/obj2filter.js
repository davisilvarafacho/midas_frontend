export function obj2Filter(obj) {
    return Object.entries(obj)
      .map((arr) => arr.join("="))
      .join("&");
  }