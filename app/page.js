import Image from "next/image";
import Button from "./Components/Button";
export default function Home() {
  return (
    <div className="container">

        <div className="brand_logo">
          
        </div>
      <div className="joinWaitlist">
        <h1>Join the wait list</h1>
        <p>Get notified when we launch.</p>
        <input type="email" placeholder="example@mail.com" /><br />

        <Button />
      </div>
    </div>
  );
}
