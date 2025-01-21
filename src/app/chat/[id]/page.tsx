"use client"

// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {GoogleGenerativeAI} from '@google/generative-ai'
import { useSearchParams } from 'next/navigation';
import logo from '../../../../public/Logo.svg'
import Image from "next/image";
import { Button } from "@nextui-org/react";



// type Props = {
//   params: { id: string };
// };

// export async function generateMetadata({ params }: Props) {
//   const ogImageUrl = `https://omniplex.ai/api/og?id=${params.id}`;

//   return {
//     title: "Omniplex",
//     description: "Search online with the power of AI. Try now!",
//     openGraph: {
//       title: "Omniplex - Web Search AI",
//       description: "Search online with the power of AI. Try now!",
//       images: [
//         {
//           url: ogImageUrl,
//           width: 1200,
//           height: 630,
//           alt: "Omniplex - Web Search AI",
//         },
//       ],
//       url: `https://omniplex.ai/chat/${params.id}`,
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: "Omniplex - Web Search AI",
//       description: "Search online with the power of AI. Try now!",
//       images: [
//         {
//           url: ogImageUrl,
//           width: 1200,
//           height: 630,
//           alt: "Omniplex - Web Search AI",
//         },
//       ],
//     },
//   };
// }

const ChatPage = () => {
  // return (
  //   <AuthWrapper>
  //     <Chat id={params.id} />
  //   </AuthWrapper>
  // );
  // const router = useRouter();
  const [messages, setMessages] = useState<any>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug'); // Get 'slug' from the URL
  const firstPrompt = searchParams.get('firstPrompt'); // Get 'firstPrompt' from the URL
  useEffect(() => {
    // if (!router.isReady) return;
    const fetchFirstPromptResponse = async () => {
      // const firstPrompt = router.query.firstPrompt;

      if (!firstPrompt) return;

      setLoading(true);

      // Fetch response for the first prompt
      // const response = await fetch("/api/gemini", {
      //   method: "POST",
      //   body: JSON.stringify({ prompt: firstPrompt }),
      //   headers: { "Content-Type": "application/json" },
      // });
      // const data = await response.json();
    const genAI = new GoogleGenerativeAI("AIzaSyCFJm5Wtpe4X9OWORlYYeMvXlfGP5KOS3k");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const result = await model.generateContent(firstPrompt);
    // setGemAns(result.response.text());
      // Add the first message to the chat
      setMessages([
        {
          prompt: firstPrompt,
          response: result.response.text() || "No response available.",
        },
      ]);

      setLoading(false);
    };

    
      fetchFirstPromptResponse();
    
  }, [firstPrompt]);

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim()) return;

    // const newMessage = { prompt: inputPrompt, response: "Loading..." };
    // setMessages((prev:any) => [...prev, newMessage]);

    // const response = await fetch("/api/gemini", {
    //   method: "POST",
    //   body: JSON.stringify({ prompt: inputPrompt }),
    //   headers: { "Content-Type": "application/json" },
    // });
    // const data = await response.json();
    setLoading(true)
    const genAI = new GoogleGenerativeAI("AIzaSyCFJm5Wtpe4X9OWORlYYeMvXlfGP5KOS3k");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const result = await model.generateContent(inputPrompt);

    // setMessages((prev:any) =>
    //   prev.map((msg:any, index:any) =>
    //     index === prev.length - 1
    //       ? { ...msg, response: result.response.text() || "No response available." }
    //       : msg
    //   )
    // );
    setMessages((prev: any) => [
      ...prev, // Keep previous messages
      { prompt: inputPrompt, response: result.response.text() || "No response available." },
    ]);
    setLoading(false)
    setInputPrompt("");
  };

  return (
    <div className="min-h-[100vh] pt-14 max-w-[100vw] mx-64">
      <div className="messages">
        {messages.map((msg:any, index:any) => (
          <div key={index} className="message">
            <h1 className="mb-5 text-2xl">{msg.prompt}</h1>
            <p className="flex gap-3 mb-3"><Image src={logo} alt="" height={20} width={20}/><span>Answer</span></p>
            <p className="mb-2">{msg.response}</p>
            <div className="w-full h-[0.5px] bg-gray-300 mb-5"></div>
          </div>
        ))}
      </div>
      {loading && <p className="mb-2"> Loading...</p>}
      <div className="flex justify-center items-center z-10 mb-4 px-5">
        <input 
          type="text"
          placeholder="Enter your prompt..."
          className="text-[#fff] bg-[#232323] w-full mr-2 rounded-2xl"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
        />
        {/* <button onClick={handleSendPrompt}>Send</button> */}
        <Button color="primary" onClick={handleSendPrompt} isDisabled={loading}>Button</Button>
      </div>
    </div>
  );

};

export default ChatPage;
