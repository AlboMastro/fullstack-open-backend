const dummy = (blogs) => {
    const noBlogs = "Seems like you have no blogs. Why don't you try adding one?"

    const dummyPlacer = () => {
        if (blogs.length === 0) {
            return blogs.push(noBlogs)
        }
    }

    return dummyPlacer()
}

const totLikes = (blogs) => {
    const getSumByKey = (arr, key) => {
        return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
    }
    
    if (blogs.length === 0) {
        return 0
    } else {
        return getSumByKey(blogs, 'likes')
    }
}

const favBlog = (blogs) => {
   return blogs.length === 0 
   ? [{}]
   : blogs.reduce((accumulator, current, index) => {
    if (index === 0) {
        return current
    };
    return accumulator.likes > current.likes ? accumulator : current
   });
}

module.exports = {
    dummy,
    totLikes,
    favBlog
}