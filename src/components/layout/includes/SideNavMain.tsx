// import { useUser } from "@/context/user";
// import VendorMenu from "@/components/VendorMenu";
import MainMenu from "@/components/MainMenu";

export default function SideNavMain() {
  // const { user } = useUser();

  return (
    <>
      <div className="fixed z-20 hidden h-full w-[230px] overflow-auto border-e bg-white pe-2 ps-2 pt-[70px] md:block rtl:ps-6">
        <div className="mx-auto w-full">
          <MainMenu />
          {/* {user?.isVendor ? <VendorMenu /> : null} */}
        </div>
      </div>
    </>
  );
}
