import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{marginTop:'8px'}} className="mt-6 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">

        <p className="text-xs md:text-sm text-gray-600 text-center md:text-left">
          © 2026{" "}
          <span className="font-semibold text-gray-900">IntelliBuy</span>. All
          rights reserved.
        </p>

        <p className="text-xs md:text-sm text-gray-500 text-center">
          Made with <span className="text-red-500">❤</span> by{" "}
          <span className="font-semibold text-gray-800">Shivam Mishra</span>
        </p>

        <div className="flex gap-4 mt-1 md:mt-0">
          <a
            href="https://github.com/Sm6718858"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-black transition"
            title="GitHub"
          >
            <Github size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/shivam134"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-blue-600 transition"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>

          <a
            href="mailto:sm6718858@gmail.com"
            className="text-gray-600 hover:text-indigo-600 transition"
            title="Contact"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
