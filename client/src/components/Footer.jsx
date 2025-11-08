import React from "react";

function Footer() {
  return (
    <>
      <div className="text-center mt-5 w-full bg-gray-100">
        <div className="pt-5 mb-4">
          <a href="/"><i className="fa-brands fa-instagram text-xl mr-2"></i></a>
          <a href="/"><i className="fa-brands fa-facebook-f text-xl mr-2"></i></a>
          <a href="/"><i className="fa-brands fa-linkedin-in text-xl mr-2"></i></a>
        </div>
        <p className="mb-2 ">@Wanderlust Private Limited</p>
        <p className="pb-5">Privacy Terms</p>
      </div>
    </>
  );
}

export default Footer;
