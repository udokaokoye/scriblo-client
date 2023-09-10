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
              
            </>
          )}
          <br />
        </>
      )}
      <br />
      <br />
      <br />
      <br />
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
