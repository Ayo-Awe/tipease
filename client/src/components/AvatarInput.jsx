import { forwardRef, useRef, useState } from "react";
import { Avatar } from "@nextui-org/react";
import { HiOutlineCamera } from "react-icons/hi2";
import { mergeRefs } from "../utils";

const AvatarInput = forwardRef(
  ({ className, onChange, name, onBlur, errorMessage }, ref) => {
    const [image, setImage] = useState();
    const localRef = useRef();
    const avatarClassName = errorMessage
      ? `${className} border-2 border-[#C00612]`
      : className;

    return (
      <>
        <input
          type="file"
          className="hidden"
          ref={mergeRefs(localRef, ref)}
          name={name}
          onBlur={onBlur}
          onChange={(e) => {
            if (e.target.files) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setImage(e.target.result);
              };
              reader.readAsDataURL(e.target.files[0]);
            }
            onChange(e);
            7;
          }}
        />

        <Avatar
          src={image}
          showFallback={true}
          size="lg"
          className={avatarClassName}
          onClick={() => {
            if (localRef.current) {
              localRef.current.click();
            }
          }}
          fallback={<HiOutlineCamera size={40} />}
        />
      </>
    );
  }
);

export default AvatarInput;
