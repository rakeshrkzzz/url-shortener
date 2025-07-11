import React, { useEffect, useState } from 'react'
import { generateUniqueString, isValidURL } from '../Utils'
import { Database, useCustomToast } from '../Library';
import Spinner from './Spinner';

const Shortner = () => {

    const { showSuccess, showError, showWarn } = useCustomToast();
    const [originalUrl, setOriginalUrl] = useState<string>("");
    const [convertedUrlState, setConvertedUrlState] = useState<string>("")
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const [isConvertedUrl, setIsConvertedUrl] = useState<string>("")

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setOriginalUrl(e.target.value);
    }


    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isValidURL(originalUrl)) {
            setIsSubmit(true);
            const convertedUrl: string = await generateUniqueString();
            setConvertedUrlState(convertedUrl);
            await Database.addUrl({
                originalUrl,
                convertedUrl
            })
            showSuccess("Enter url to shortener")
            setIsSubmit(false);
        } else if (originalUrl === '') {
            showWarn("Enter url to shortener")
        } else {
            showError("Invalid URL")
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href + convertedUrlState).then(() => {
            showSuccess("Copied!")
        }).catch(() => {
            showError("Failed to copy")
        });
    };

    useEffect(() => {
        // Get the current URL path
        const path = window.location.pathname;
        const value = path.substring(path.lastIndexOf('/') + 1);
        if (value !== "") {
            setIsConvertedUrl(value)
        } else {
            setIsConvertedUrl("")
        }
    }, [])

    useEffect(() => {
        if (isConvertedUrl !== "") {
            Database.getUrl(isConvertedUrl).then((data) => {
                if (data.docs.length > 0) {
                    const result = data.docs[0].data();
                    window.location.href = `https://${result.original_url}`;
                    // const newTab = window.open(`https://${result.original_url}`, "_blank");
                    // if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
                    //     console.error("Popup blocked! Allow pop-ups in browser settings.");
                    //     showError("Popup blocked! Please allow pop-ups in browser settings.");
                    //     setTimeout(() => {
                    //         window.location.href = "/";
                    //     }, 2000);
                    // } else {
                    //     // Redirect current tab only if new tab opens successfully
                    //     window.location.href = "/";
                    // }
                }
                else {
                    console.error("No matching data found");
                    showError("No matching URL found.");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                }
            }).catch((err) => {
                console.error(err);
                showError(err)
            })
        }
    }, [isConvertedUrl, showError])



    return (
        <>
            {isConvertedUrl !== "" ? <>
                <h1 className='text-5xl font-semibold'><Spinner /></h1>
            </> :
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className='font-bold text-center mb-4 text-2xl px-16'>Free URL Shortener</h1>
                    <div className="mb-4">
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                https://
                            </span>
                            <input
                                type="text"
                                id="original_url"
                                name="original_url"
                                placeholder="Enter link here"
                                onChange={handleOnChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                    }
                                }}
                                value={originalUrl}
                                className="px-3 py-2 flex-1 block w-full rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={onSubmit}
                            type="button">

                            {isSubmit &&
                                <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
                                </svg>
                            }
                            Shorten URL
                        </button>
                    </div>

                    {convertedUrlState &&
                        <>
                            <div >
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shortened_url">
                                    Shortned URL
                                </label>
                            </div>

                            <div className="flex">
                                <input
                                    value={window.location.href + convertedUrlState}
                                    disabled
                                    type="text"
                                    id="shortened_url"
                                    name="shortened_url"
                                    className="px-3 py-2 flex-1 block w-full rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <span
                                    onClick={copyToClipboard}
                                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-blue-400 bg-blue-500 text-white hover:bg-blue-700 text-sm font-semibold">
                                    Copy
                                </span>
                            </div>
                        </>
                    }
                    <p className='text-xs italic mt-4'>By clicking Shorten URL,
                        you agree to our <a href="sample.com" className='text-red-600'>Terms of Use and Privacy Policy</a>.</p>
                    <p className='text-xs italic mt-4 flex justify-center items-center'>&copy; 2024 Rakesh. All rights reserved.</p>

                </form>
            }
        </>
    )
}

export default Shortner