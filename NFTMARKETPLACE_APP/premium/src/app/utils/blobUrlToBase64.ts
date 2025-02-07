export const blobUrlToBase64 = async (blobUri: string): Promise<string | null> => {
    try {
        const response = await fetch(blobUri);
        const blob = await response.blob();

        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.readAsDataURL(blob);
        })
    } catch(error) {
        console.error('Error converting blob to base64:', error);
         return null;
    }
}