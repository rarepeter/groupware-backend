const createDto = <T, K extends keyof T>(
    fullEntity: T,
    selectedKeys: readonly K[],
  ): { [P in K]: T[P] } => {
    const dtoObject = {} as { [P in K]: T[P] };
    selectedKeys.forEach((key) => {
      dtoObject[key] = fullEntity[key];
    });
  
    return dtoObject;
  };
  
  export { createDto };
  