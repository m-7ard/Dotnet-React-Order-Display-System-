export const getLocalUrl = (path: string) => {
    return new URL(
        path,
        import.meta.url,
    ).href
}