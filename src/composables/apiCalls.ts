import { api } from 'src/boot/axios';
import { onFailure } from 'src/utils/notification';

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

    let errorMessage = 'Some error occured, unable to fetch data.';

    if (response.status === 401) {
      errorMessage = response.statusText;
    } else if (response.data) {
      errorMessage = response.data.displayMessage;
    }

    // replace this with alert dialog when it is merged (alert dialog present in account head pr)
    onFailure({ msg: errorMessage });
  }
};

export { useFetch };
