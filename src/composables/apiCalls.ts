/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'src/boot/axios';
import { onSuccess, alertDialog } from 'src/utils/notification';

interface API_OBJECT {
  responseStatus: null;
  id: number | null;
  childId: null;
  code: null;
  codes: null;
  displayMessage: 'Item is now in-active';
  responseCode: null;
  object: null;
  inactiveOnBy: string | null;
  updatedOnBy: string | null;
  createdOnBy: string | null;
}

const handleError = (
  response: { [key: string]: any },
  defaultMessage: string
) => {
  let errorMessage = defaultMessage;
  if (response.status === 401) {
    errorMessage = response.statusText;
  } else if (response.data) {
    errorMessage = response.data.displayMessage;
  }

  // replace this with alert dialog when it is merged (alert dialog present in account head pr)
  alertDialog(errorMessage);
};

const useFetch = async (url: string): Promise<unknown | null> => {
  try {
    const rsp = await api.get(url);

    if (rsp.data) {
      return rsp.data;
    } else {
      return null;
    }
  } catch (e) {
    // @ts-expect-error intended spred of error object

    const { response } = { ...e };

    const errorMessage = 'Some error occured, unable to fetch data.';
    handleError(response, errorMessage);
    return null;
  }
};

const usePost = async (
  url: string,
  payload: { [key: string]: any }
): Promise<API_OBJECT | null> => {
  try {
    const rsp = await api.post(url, payload);

    if (rsp.data) {
      onSuccess({ msg: rsp.data.displayMessage });
      return rsp.data;
    } else {
      return null;
    }
  } catch (e) {
    // @ts-expect-error intended spred of error object

    const { response } = { ...e };

    const errorMessage = 'Some error occured, unable to post data.';
    handleError(response, errorMessage);
    return null;
  }
};

const usePut = async (
  url: string,
  payload: { [key: string]: any }
): Promise<API_OBJECT | null> => {
  try {
    const rsp = await api.put(url, payload);

    if (rsp.data) {
      onSuccess({ msg: rsp.data.displayMessage });
      return rsp.data;
    } else {
      return null;
    }
  } catch (e) {
    // @ts-expect-error intended spred of error object

    const { response } = { ...e };

    const errorMessage = 'Some error occured, unable to update data.';
    handleError(response, errorMessage);
    return null;
  }
};

export { useFetch, usePost, usePut };
