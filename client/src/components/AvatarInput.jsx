import { useRef, useState } from "react";
import { Avatar } from "@nextui-org/react";
import { HiOutlineCamera } from "react-icons/hi2";

const AvatarInput = ({ className, onChange }) => {
  const [image, setImage] = useState();
  const avatarRef = useRef();

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={avatarRef}
        onChange={(e) => {
          if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setImage(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
          }
          onChange(e);
        }}
      />

      <Avatar
        src={image}
        showFallback={true}
        size="lg"
        className={className}
        onClick={() => {
          if (avatarRef.current) {
            avatarRef.current.click();
          }
        }}
        fallback={<HiOutlineCamera size={40} />}
      />
    </>
  );
};

export default AvatarInput;
