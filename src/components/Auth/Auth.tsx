import React, { useState, useEffect } from "react";
import styles from "./Auth.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Spinner from "../Spinner/Spinner";
import { data1 } from "./data";

type Props = {
  isOpen: boolean;
  onClose: () => void; 
};

const Auth = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const colors = ["white", "white", "white", "white"]; // Define your colors
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            userDetails: {
              email: user.email,
              name: user.displayName,
              profilePic: user.photoURL,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          userDetails: {
            email: user.email,
            name: user.displayName,
            profilePic: user.photoURL,
            createdAt: serverTimestamp(),
          },
        });
      }

      dispatch(setAuthState(true));
      dispatch(
        setUserDetailsState({
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          profilePic: user.photoURL ?? "",
        })
      );
      props.onClose();
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [colors.length]);

  return (
    <Modal
      size="5xl"
      scrollBehavior={"inside"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className={styles.modal}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Image
                  width={20}
                  height={20}
                  src={"/Logo.svg"}
                  alt={"X"}
                  className="mr-3"
                />
                <p className="text-[#edededaa]">Omniplex</p>
              </div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={`${styles.container} lg:flex h-100 w-100`}>
              <div className="h-100 lg:w-[50vw] w-[100vw] lg:mb-0 mb-4">
                <h1 className={`${styles.title} mb-3`}>Get Started,</h1>
                <h1 className={`${styles.title} mb-6`}>From Here</h1>
                <p className={`${styles.text} mb-6`}>
                  Privacy-first AI that helps you create in confidence.
                </p>
                <div className="p-12 bg-[#161616] lg:w-[450px] w-[90vw] rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Image
                        width={30}
                        height={30}
                        src={"/Logo.svg"}
                        alt={"X"}
                        className="mr-3"
                      />
                    </div>
                    <h1 className="text-[#edededaa] text-3xl">Log in</h1>
                  </div>
                  {loading ? (
                    <div className={styles.button}>
                      <div className={styles.spinner}>
                        <Spinner />
                      </div>
                      <div className={styles.buttonText}>Signing in</div>
                    </div>
                  ) : (
                    <div className={styles.button} onClick={handleAuth}>
                      <Image
                        src={"/svgs/Google.svg"}
                        alt={"Google"}
                        width={24}
                        height={24}
                      />
                      <div className={styles.buttonText}>
                        Continue with Google
                      </div>
                    </div>
                  )}
                  <p className="text-[#edededaa] text-xs">
                    By continuing, you agree to Omniplex&apos;s Consumer Terms{" "}
                  </p>
                  <p className="text-[#edededaa] text-xs">
                    {" "}
                    and Usage Policy, and acknowledge their Privacy Policy.
                  </p>
                </div>
              </div>
              <div className="w-[600px] h-[80vh] bg-[#161616] rounded-xl flex flex-col items-center py-10 px-10">
                <div>
                  <div className="flex items-center mb-3">
                    <Image
                      width={20}
                      height={20}
                      src={`/svgs/profile${currentIndex + 1}.svg`}
                      alt=""
                      className="mr-2"
                    />
                    <p className="text-[#edededaa] text-sm ">
                      {data1[currentIndex].ques}
                    </p>
                  </div>
                  <div className="flex items-center mb-3">
                    <Image
                      width={20}
                      height={20}
                      src={"/Logo.svg"}
                      alt={"X"}
                      className="mr-3"
                    />
                    <p className="text-[#edededaa] text-sm">
                      {data1[currentIndex].ans}
                    </p>
                  </div>
                  <Image
                    width={400}
                    height={400}
                    src={`./svgs/group${currentIndex + 1}.svg`}
                    alt=""
                    className="mb-6"
                  />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor:
                          index === currentIndex ? color : "grey",
                        transition: "background-color 0.5s ease",
                      }}
                      onClick={() => setCurrentIndex(index)}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Auth;
