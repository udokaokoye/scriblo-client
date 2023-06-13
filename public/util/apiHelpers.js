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

export async function followUser (followingID, followerID) {
    
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
    const response = await fetch(`/api/posts/actions.php?data=likes&postId=${postId}`)
    const data = await response.json()
    return data.data
}

export async function getBookmarks (userId) {
    const response = await fetch(`/api/posts/actions.php?data=bookmarks&userId=${userId}`)
    const data = await response.json()
    return data.data
}

export async function deleteComment (commentId) {
const response = await fetch(`/api/posts/actions.php?data=comment&id=${commentId}`, {method: "DELETE"})
const data = await response.json()
return data;
}