'use client'
import HomepageShowcase from "@/Components/HomepageShowcase";
import HomepageTrending from "@/Components/HomepageTrending";



export default function Home() {
  const articles = [
    {
      title: "The Power of Positive Thinking",
      description: "Discover how a positive mindset can transform your life and lead to greater success and happiness.",
      authorAvatar: "https://example.com/avatar1.jpg",
      authorName: "John Smith",
      date: "2023-05-28",
      readTime: "8 min read",
      slug: "power-of-positive-thinking",
      image: "https://example.com/image1.jpg"
    },
    {
      title: "10 Tips for Effective Time Management",
      description: "Learn practical strategies to manage your time more efficiently and boost productivity.",
      authorAvatar: "https://example.com/avatar2.jpg",
      authorName: "Emily Johnson",
      date: "2023-05-25",
      readTime: "5 min read",
      slug: "tips-for-time-management",
      image: "https://example.com/image2.jpg"
    },
    {
      title: "The Benefits of Regular Exercise",
      description: "Explore the numerous advantages of incorporating regular exercise into your daily routine.",
      authorAvatar: "https://example.com/avatar3.jpg",
      authorName: "David Thompson",
      date: "2023-05-22",
      readTime: "7 min read",
      slug: "benefits-of-regular-exercise",
      image: "https://example.com/image3.jpg"
    },
    {
      title: "Introduction to Machine Learning",
      description: "Get an overview of machine learning and understand its applications in various industries.",
      authorAvatar: "https://example.com/avatar4.jpg",
      authorName: "Sophia Anderson",
      date: "2023-05-18",
      readTime: "10 min read",
      slug: "introduction-to-machine-learning",
      image: "https://example.com/image4.jpg"
    },
    {
      title: "The Art of Effective Communication",
      description: "Master the essential communication skills to enhance your personal and professional relationships.",
      authorAvatar: "https://example.com/avatar5.jpg",
      authorName: "Michael Davis",
      date: "2023-05-15",
      readTime: "6 min read",
      slug: "art-of-communication",
      image: "https://example.com/image5.jpg"
    },
    {
      title: "10 Delicious and Healthy Recipes",
      description: "Try these mouthwatering recipes that are both nutritious and satisfying for your taste buds.",
      authorAvatar: "https://example.com/avatar6.jpg",
      authorName: "Sarah Thompson",
      date: "2023-05-12",
      readTime: "12 min read",
      slug: "delicious-healthy-recipes",
      image: "https://example.com/image6.jpg"
    }
  ];
  

  return (
    <>
      <HomepageShowcase />
      <br />
      <br />
      <br />
      <HomepageTrending trends={articles} />
    </>
  )
}
