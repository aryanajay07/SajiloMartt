import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12  bottom-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">About Sajilomart</h3>
            <p className="text-sm">
              Sajilomart is your one-stop destination for all your shopping needs. From electronics to fashion, we've got you covered!
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="text-sm">
              <li><a href="#">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <ul className="text-sm">
              <li>Email: info@sajilomart.com</li>
              <li>Phone: 123-456-7890</li>
              <li>Follow us on <a href="#">Facebook</a>, <a href="#">Twitter</a>, and <a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-8 border-gray-700" />
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} Sajilomart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
