const dummy = (blogs) => {
    const noBlogs = "Seems like you have no blogs. Why don't you try adding one?"

    const dummyPlacer = () => {
        if (blogs.length === 0) {
            return blogs.push(noBlogs)
        }
    }

    return dummyPlacer()
}

module.exports = {
    dummy
}