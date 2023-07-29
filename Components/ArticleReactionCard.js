'use client'
import { useEffect, useState } from 'react';
import { source_Sans_Pro } from '@/public/util/fonts';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import TwitterIcon from '@mui/icons-material/Twitter';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import { getLikes, likePost, getBookmarks, bookmarkPost } from '@/public/util/apiHelpers';

function ArticleReactionCard({postId, userId, session, preview}) {
    const [showShareMenu, setshowShareMenu] = useState(false)
    const [likes, setlikes] = useState([])
    const [likesCount, setlikesCount] = useState(0)
    const [isPostLiked, setisPostLiked] = useState(false)
    const [isBookedMarked, setisBookedMarked] = useState(false)

    const getallLikes = async () => {
      const allLikes =await getLikes(postId)
      allLikes !== null && setlikesCount(allLikes?.length)
      allLikes !== null && setlikes(allLikes)
      allLikes !== null && setisPostLiked(allLikes?.filter(like => like?.userId == userId).length > 0)
    }

    const getAllBookmarks = async () => {
      const allBookmarks = await getBookmarks(userId)
      allBookmarks !== null && setisBookedMarked(allBookmarks?.filter(bookmark => bookmark?.id == postId).length > 0)
    }

    useEffect(() => {
      const getData = async () => {
        await getallLikes()
        await getAllBookmarks()
      }
      getData()
    }, [])

    const handleLike = async () => {
      if(!session?.token) {
        alert('Please login to like this post')
        return;
      }
      setisPostLiked(!isPostLiked)
      isPostLiked ? setlikesCount(likesCount - 1) : setlikesCount(likesCount + 1)
      await likePost(postId, userId)
      getallLikes()
      
    }

    const handleBookmark = async () => { 
      if(!session?.token) {
        alert('Please login to bookmark this post')
        return;
      }
      setisBookedMarked(!isBookedMarked)
      await bookmarkPost(postId, userId)
      getAllBookmarks()
    }
    
  return (
    <div className='articleReactionCard'>
        <div className={`reactions ${source_Sans_Pro.className}`}>
        <span onClick={() => !preview && handleLike()}>{isPostLiked ? (<FavoriteIcon className='actionIcon' />) : (<FavoriteBorderIcon className='actionIcon' /> )}{likesCount}</span>
        <span onClick={() => !preview && document.getElementById('commentScrollHolder').scrollIntoView()}><ChatBubbleOutlineOutlinedIcon className='actionIcon' /></span>
        </div>
        <div className="actions">
            <span onClick={() => !preview && handleBookmark()}>{isBookedMarked ? (<BookmarkOutlinedIcon className='actionIcon' />) : (<BookmarkAddOutlinedIcon className='actionIcon' />)}</span>
            <PlayCircleOutlineOutlinedIcon className='actionIcon' />
            <span onClick={() => !preview && setshowShareMenu(!showShareMenu)}><IosShareOutlinedIcon className='actionIcon shareIcon' /></span>
            
            <div style={{display: showShareMenu ? 'block' : 'none'}} className="shareMenu">
                <div className="shareOption"><InsertLinkIcon /> Copy</div>
                <div className="shareOption"><TwitterIcon /> Twitter</div>
                <div className="shareOption"><FacebookOutlinedIcon /> Facebook</div>
            </div>
            <span title='Flag this article'><FlagOutlinedIcon className='actionIcon' /></span>
        </div>
    </div>
  )
}

export default ArticleReactionCard