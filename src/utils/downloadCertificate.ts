import RNBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-toast-message';

export const saveCertificate = async (url: string) => {
  try {
    const filename = `certificate_${Date.now()}.pdf`;
    const path = `${RNBlobUtil.fs.dirs.DownloadDir}/${filename}`;

    await RNBlobUtil.config({
      path,
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path,
        description: 'Downloading certificate',
      },
    }).fetch('GET', url);
    Toast.show({
      type: 'success',
      text1: 'Download Complete!',
      text2: 'Your certificate was saved successfully.',
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Download Failed',
      text2: 'There was an error saving your certificate.',
    });
  }
};
