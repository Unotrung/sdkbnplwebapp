import { appIdHV, appKeyHV, transactionId } from './keys.js';

export async function fetchToken() {
    try {
        const url = 'https://apibnpl.voolo.vn/v1/bnpl/fec/getHVToken';
        const data = await fetch(url);
        const json = await data.json();
        const { token } = json;
        const jwttoken = token.split(' ')[1];
        return jwttoken;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};

export async function getHV() {
    try {
        await fetchToken()
            .then((res) => {
                console.log('Get HV Token');

                HyperSnapSDK.init(res, HyperSnapParams.Region.AsiaPacific);

                HyperSnapSDK.startUserSession();
            })
            .catch((err) => console.log(err))
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};

export async function LaunchFaceCaptureScreen() {
    // Launch Face Capture Screen (Khởi chạy màn hình chụp khuôn mặt)
    try {
        console.log('Launch Face Capture Screen');
        var hvFaceConfig = new HVFaceConfig();
        hvFaceConfig.setShouldShowInstructionPage(true);
        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                var errorMessage = HVError.getErrorMessage();
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
            }
        };
        HVFaceModule.start(hvFaceConfig, callback);
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
};

export async function LaunchDocumentCaptureScreen() {
    try {
        console.log('Launch Document Capture Screen');
        var hvDocConfig = new HVDocConfig();
        hvDocConfig.setOCRDetails("https://vnm-docs.hyperverge.co/v2/nationalID", hvDocConfig.DocumentSide.FRONT, {}, {});
        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                var errorMessage = HVError.getErrorMessage();
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
                var imageBase64 = HVResponse.getImageBase64();
                var attemptsCount = HVResponse.getAttemptsCount();
            }
        };
        HVDocsModule.start(hvDocConfig, callback);
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

export async function runFaceCaptureScreen() {
    try {
        await getHV();
        await LaunchFaceCaptureScreen();
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

export async function runDocumentCaptureScreen() {
    try {
        await getHV();
        await LaunchDocumentCaptureScreen();
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

export async function makeFaceMatch() {
    try {
        callback = (HVError, HVResponse) => {
            if (HVError) {
                var errorCode = HVError.getErrorCode();
                var errorMessage = HVError.getErrorMessage();
            }
            if (HVResponse) {
                var apiResults = HVResponse.getApiResult();
                var apiHeaders = HVResponse.getApiHeaders();
            }
        };
        HVNetworkHelper.makeFaceMatchCall(faceImageBase64String, docImageBase64String, {}, {}, callback);
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

export async function postNationalID(image) {
    try {
        let data = $.ajax({
            url: 'https://vnm-docs.hyperverge.co/v2/nationalID',
            type: 'POST',
            async: false,
            data: JSON.stringify(image),
            dataType: 'json',
            headers: {
                'Content-Type': 'multipart/form-data',
                'appKey': appKeyHV,
                'appId': appIdHV,
                'transactionId': transactionId
            }
        });
        return data.responseJSON;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}


