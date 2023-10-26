import { ResponseJson } from '../data-retrieve-types';

const constructResponseJson = <TData>(
  data: NonNullable<TData>,
): ResponseJson<TData> => {
  const responseJson: ResponseJson<TData> = {
    data,
  };

  return responseJson;
};

export { constructResponseJson };
