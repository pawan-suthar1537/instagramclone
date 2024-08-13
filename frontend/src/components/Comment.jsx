import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment = ({ cmnt }) => {
  console.log(cmnt);

  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={cmnt?.author?.profilepic} alt="userpic" />
          <AvatarFallback>{cmnt?.author?.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold ">
            {cmnt?.author?.username}{" "}
            <span className="font-normal">{cmnt?.text}</span>
          </div>
          {/* <span>bio here</span> */}
        </div>
      </div>
    </div>
  );
};

export default Comment;
