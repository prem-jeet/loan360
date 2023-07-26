/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'src/boot/axios';
import { onFailure, onSuccess } from 'src/utils/notification';

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
  onFailure({ msg: errorMessage });
};

const useFetch = async (url: string) => {
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
  }
};

const usePost = async (url: string, payload: { [key: string]: any }) => {
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
  }
};

const usePut = async (url: string, payload: { [key: string]: any }) => {
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
  }
};

export { useFetch, usePost, usePut };
