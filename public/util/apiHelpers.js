import moment from "moment";
export async function likePost (postID, userID) {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData()
    formData.append('action', 'likepost')
    formData.append('postId', postID)
    formData.append('userId', userID)
    formData.append('date', date)
    const response = await fetch(`/api/posts/actions.php`, {
        method: "POST",
        body: formData
    })
    const data = await response.json()
    return data
}

export async function commentPost (postId, comment, userId, replyId) {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData()
    formData.append('action', 'commentpost')
    formData.append('postId', postId)
    formData.append('comment', comment)
    formData.append('userId', userId)
    formData.append('replyId', replyId)
    formData.append('date', date)
    const response = await fetch('/api/posts/actions.php', {
        method: 'POST',
        body: formData
    })
    const data = await response.json()
    return data
}

export async function followUser (followingID, userId) {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData()
    formData.append('action', 'followuser')
    formData.append('followId', followingID)
    formData.append('userId', userId)
    formData.append('date', date)

    const response = await fetch('/api/users/actions.php', {method: "POST", body: formData})
    const data = await response.json()
    return data
}

export async function unfollowUser (unfollowingID, userId) {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const formData = new FormData()
    formData.append('action', 'unfollowuser')
    formData.append('unfollowId', unfollowingID)
    formData.append('userId', userId)

    const response = await fetch('/api/users/actions.php', {method: "POST", body: formData})
    const data = await response.json()
    return data
}

export async function bookmarkPost (postID, userID) {
    const formData = new FormData()
    formData.append('action', 'bookmarkpost')
    formData.append('postId', postID)
    formData.append('userId', userID)
    formData.append('date', moment().format('YYYY-MM-DD HH:mm:ss'))
    const response = await fetch('/api/posts/actions.php', {
        method: 'POST',
        body: formData
    })
    const data = await response.json()
    return data;

}

export async function submitReport (postID, userID, commentID, reason) {
    
}

export async function getComments (postId) {
    const response = await fetch(`/api/posts/actions.php?data=comments&postId=${postId}`)
    const data = await response.json()
    // console.log(data.data)
    return data.data;
}

export async function getLikes (postId) {
    const response = await fetch(`${process.env.API_URL}/posts/actions.php?data=likes&postId=${postId}`)
    const data = await response.json()
    return data.data
}

export async function getBookmarks (userId) {
    const response = await fetch(`${process.env.API_URL}/posts/actions.php?data=bookmarks&userId=${userId}`)
    const data = await response.json()
    return data.data
}

export async function getUserFollows (userId) {
    const response = await fetch(`/api/users/actions.php?action=getUserFollows&userId=${userId}`)
    const data = await response.json()
    return data.data
}

export async function deleteComment (commentId) {
    const formData = new FormData()
    formData.append('action', 'deletecomment')
    formData.append('commentId', commentId)
const response = await fetch(`/api/posts/actions.php?data=comment&id=${commentId}`, {method: "POST", body: formData})
const data = await response.json()
return data;
}

export async function deleteBookmark (bookmarkId) {
    const formData = new FormData();
    formData.append('action', 'deleteBookmark')
    formData.append("bookmarkId", bookmarkId)

    const response = await fetch('/api/posts/actions.php', {method: "POST", body: formData})
    const data = await response.json();
    // return data;
}

export async function deletePost (postId, sessionToken) {
    const formData = new FormData();
    formData.append('action', 'deletePost')
    formData.append("postId", postId)
    formData.append("authToken", sessionToken)

    const response = await fetch('/api/posts/actions.php', {method: "POST", body: formData})
    const data = await response.json();
    return data;
}

export async function pinArticle (postId) {
    const formData = new FormData()
    formData.append('action', 'pinPost')
    formData.append('postId', postId)

    const response = await fetch('/api/posts/actions.php', {method: "POST", body: formData})
    const data = await response.json()
    console.log(data)
    return data
}

export async function unpinArticle (postId) {
    const formData = new FormData()
    formData.append('action', 'unpinPost')
    formData.append('postId', postId)

    const response = await fetch('/api/posts/actions.php', {method: "POST", body: formData})
    const data = await response.json()
    console.log(data)
    return data
}