import ChatViewCommon from "@/components/others/ChatViewCommon";
import RequireUser from "@/components/others/RequireUser";

function Page() {
  return (
    <RequireUser>
      <ChatViewCommon></ChatViewCommon>
    </RequireUser>
    // <ChatViewCommon></ChatViewCommon>
  );
}

export default Page;
