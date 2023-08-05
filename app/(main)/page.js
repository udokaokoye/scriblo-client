import HomepageShowcase from "@/Components/HomepageShowcase";
import HomepageTrending from "@/Components/HomepageTrending";
import "../../Styles/home.css";
import RecentArticles from "@/Components/RecentArticles";
import { source_Sans_Pro } from "../../public/util/fonts";
import { getServerSession } from "next-auth";
import { authOptions } from "../authentication/[...nextauth]/route";
import RecommendedTopics from "@/Components/RecommendedTopics";
import { headers } from "next/headers";
import { getTagID, getTagIDs } from "@/public/util/helpers";
import PromoteScriblo from "@/Components/PromoteScriblo";
import ReadOurBlogCTASide from "@/Components/ReadOurBlogCTASide";
// import next from "next/types";
export default async function Home({ params, searchParams }) {
  const session = await getServerSession(authOptions);

  const articles = [
    {
      title: "The Power of Positive Thinking",
      description:
        "Discover how a positive mindset can transform your life and lead to greater success and happiness.",
      authorAvatar: "https://example.com/avatar1.jpg",
      authorName: "John Smith",
      date: "2023-05-28",
      readTime: "8 min read",
      slug: "power-of-positive-thinking",
      image: "https://example.com/image1.jpg",
    },
    {
      title: "10 Tips for Effective Time Management",
      description:
        "Learn practical strategies to manage your time more efficiently and boost productivity.",
      authorAvatar: "https://example.com/avatar2.jpg",
      authorName: "Emily Johnson",
      date: "2023-05-25",
      readTime: "5 min read",
      slug: "tips-for-time-management",
      image: "https://example.com/image2.jpg",
    },
    {
      title: "The Benefits of Regular Exercise",
      description:
        "Explore the numerous advantages of incorporating regular exercise into your daily routine.",
      authorAvatar: "https://example.com/avatar3.jpg",
      authorName: "David Thompson",
      date: "2023-05-22",
      readTime: "7 min read",
      slug: "benefits-of-regular-exercise",
      image: "https://example.com/image3.jpg",
    },
    {
      title: "Introduction to Machine Learning",
      description:
        "Get an overview of machine learning and understand its applications in various industries.",
      authorAvatar: "https://example.com/avatar4.jpg",
      authorName: "Sophia Anderson",
      date: "2023-05-18",
      readTime: "10 min read",
      slug: "introduction-to-machine-learning",
      image: "https://example.com/image4.jpg",
    },
    {
      title: "The Art of Effective Communication",
      description:
        "Master the essential communication skills to enhance your personal and professional relationships.",
      authorAvatar: "https://example.com/avatar5.jpg",
      authorName: "Michael Davis",
      date: "2023-05-15",
      readTime: "6 min read",
      slug: "art-of-communication",
      image: "https://example.com/image5.jpg",
    },
    {
      title: "10 Delicious and Healthy Recipes",
      description:
        "Try these mouthwatering recipes that are both nutritious and satisfying for your taste buds.",
      authorAvatar: "https://example.com/avatar6.jpg",
      authorName: "Sarah Thompson",
      date: "2023-05-12",
      readTime: "12 min read",
      slug: "delicious-healthy-recipes",
      image: "https://example.com/image6.jpg",
    },
  ];
  const dummytopics = [
    "Tech",
    "Science",
    "Health",
    "Travel",
    "Food",
    "Fashion",
    "Fitness",
    "Decor",
  ];

  const moreArticles = [
    {
      title: "The Importance of Regular Exercise",
      summary:
        "Discover the benefits of incorporating regular exercise into your daily routine.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      categories: ["Health", "Fitness"],
      readTime: "5 minutes",
      coverImage: "https://example.com/cover-image1.jpg",
      publishDate: "2 days ago",
      authorAvatar: "https://example.com/author-avatar1.jpg",
      authorName: "John Smith",
    },
    {
      title: "10 Delicious and Healthy Breakfast Ideas",
      summary:
        "Start your day off right with these nutritious and tasty breakfast options.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      categories: ["Food", "Health"],
      readTime: "7 minutes",
      coverImage: "https://example.com/cover-image2.jpg",
      publishDate: "5 days ago",
      authorAvatar: "https://example.com/author-avatar2.jpg",
      authorName: "Emily Johnson",
    },
    {
      title: "Tips for Productive Remote Work",
      summary:
        "Maximize your productivity while working remotely with these helpful tips and strategies.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      categories: ["Remote Work", "Productivity"],
      readTime: "6 minutes",
      coverImage: "https://example.com/cover-image3.jpg",
      publishDate: "1 day ago",
      authorAvatar: "https://example.com/author-avatar3.jpg",
      authorName: "Michael Davis",
    },
    {
      title: "Exploring the Wonders of Space",
      summary:
        "Embark on a fascinating journey through the vastness of space and uncover its mysteries.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      categories: ["Space", "Astronomy"],
      readTime: "8 minutes",
      coverImage: "https://example.com/cover-image4.jpg",
      publishDate: "3 days ago",
      authorAvatar: "https://example.com/author-avatar4.jpg",
      authorName: "Sarah Thompson",
    },
    {
      title: "The Art of Mindfulness Meditation",
      summary:
        "Learn how to cultivate mindfulness through meditation and enhance your overall well-being.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      categories: ["Mindfulness", "Meditation"],
      readTime: "10 minutes",
      coverImage: "https://example.com/cover-image5.jpg",
      publishDate: "6 days ago",
      authorAvatar: "https://example.com/author-avatar5.jpg",
      authorName: "David Miller",
    },
    {
      title: "The Benefits of a Balanced Diet",
      summary:
        "Discover the importance of maintaining a balanced diet for optimal health and nutrition.",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      categories: ["Health", "Nutrition"],
      readTime: "7 minutes",
      coverImage: "https://example.com/cover-image6.jpg",
      publishDate: "4 days ago",
      authorAvatar: "https://example.com/author-avatar6.jpg",
      authorName: "Sophia",
    },
  ];

  // const headerList = headers()

  let feedArticle = [];
  let topics = [];

  if (session?.token) {
    let intrestIDs = getTagIDs(session?.interests);
    if (searchParams.category) {
      intrestIDs = getTagID(searchParams.category);
    }

    const res = await fetch(
      `${process.env.API_URL}/posts/index.php?categories=${intrestIDs}`,
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        next: { revalidate: 20 },
      }
    );

    const data = await res.json();
    feedArticle = data.data;
    topics = session?.interests.split(",");
    topics.unshift("Recommended");

    // console.log(data)
  } else {
    const res = await fetch(
      `${process.env.API_URL}/posts/index.php?categories=all`,
      { next: { revalidate: 20 } }
    );
    const data = await res.json();
    feedArticle = data.data;
    topics = [];
  }

  return (
    <>
      {!session?.email && (
        <>
          <HomepageShowcase source_Sans_Pro={source_Sans_Pro} />

          {feedArticle?.length >= 6 && (
            <>
              <br />
              <br />
              <br />
              <HomepageTrending
                source_Sans_Pro={source_Sans_Pro}
                trends={feedArticle}
              />
              
      <br />
      <br />
      <br />
      <br />
            </>
          )}
          <br />
        </>
      )}
      <br />
      <br />
      <div className="mainContainer">
        {/* {session?.token} */}
        <div className="articleFeed">
          <RecentArticles
            source_Sans_Pro={source_Sans_Pro}
            topics={topics}
            articles={feedArticle}
            session={session}
          />
        </div>
        <div className={`feedSidebar ${source_Sans_Pro.className}`}>
          <RecommendedTopics
            topics={dummytopics.splice(0, 5)}
            source_Sans_Pro={source_Sans_Pro}
          />
          <br />
          <br />
          <PromoteScriblo />
          <br />
          <br />
          <ReadOurBlogCTASide />
        </div>
      </div>
    </>
  );
}
