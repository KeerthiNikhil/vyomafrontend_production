import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (

    <footer
      className="
        bg-gradient-to-br
        from-blue-950
        via-blue-900
        to-blue-800
        text-white
        mt-16
      "
    >

      {/* TOP SECTION */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-16
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-12
        "
      >

        {/* BRAND */}

        <div>

          <h2 className="text-4xl font-black tracking-wide">
            VYOMA
          </h2>

          <p
            className="
              mt-5
              text-blue-100
              leading-8
              text-sm
            "
          >
            Vyoma is a modern multi-vendor marketplace
            connecting trusted local shops and customers
            for seamless online shopping, fast delivery,
            and better digital commerce experiences.
          </p>

          {/* SOCIALS */}

          <div className="flex items-center gap-4 mt-6">

            <div
              className="
                w-10 h-10
                rounded-full
                bg-white/10
                hover:bg-white/20
                flex items-center justify-center
                cursor-pointer
                transition
              "
            >
              <Facebook size={18} />
            </div>

            <div
              className="
                w-10 h-10
                rounded-full
                bg-white/10
                hover:bg-white/20
                flex items-center justify-center
                cursor-pointer
                transition
              "
            >
              <Instagram size={18} />
            </div>

            <div
              className="
                w-10 h-10
                rounded-full
                bg-white/10
                hover:bg-white/20
                flex items-center justify-center
                cursor-pointer
                transition
              "
            >
              <Twitter size={18} />
            </div>

            <div
              className="
                w-10 h-10
                rounded-full
                bg-white/10
                hover:bg-white/20
                flex items-center justify-center
                cursor-pointer
                transition
              "
            >
              <Youtube size={18} />
            </div>

          </div>

        </div>

        {/* COMPANY */}

        <div>

          <h3 className="text-xl font-semibold mb-6">
            Company
          </h3>

          <ul className="space-y-4 text-blue-100 text-sm">

            <li>
              <Link
                to="/"
                className="hover:text-white transition"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/"
                className="hover:text-white transition"
              >
                Careers
              </Link>
            </li>

            <li>
              <Link
                to="/"
                className="hover:text-white transition"
              >
                Become a Vendor
              </Link>
            </li>

            <li>
              <Link
                to="/"
                className="hover:text-white transition"
              >
                Contact Us
              </Link>
            </li>

          </ul>

        </div>

        {/* SUPPORT */}

        <div>

          <h3 className="text-xl font-semibold mb-6">
            Support
          </h3>

          <ul className="space-y-4 text-blue-100 text-sm">

            <li className="hover:text-white transition cursor-pointer">
              Help Center
            </li>

            <li className="hover:text-white transition cursor-pointer">
              Returns & Refunds
            </li>

            <li className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </li>

            <li className="hover:text-white transition cursor-pointer">
              Terms & Conditions
            </li>

            <li className="hover:text-white transition cursor-pointer">
              Shipping Policy
            </li>

          </ul>

        </div>

        {/* CONTACT */}

        <div>

          <h3 className="text-xl font-semibold mb-6">
            Contact
          </h3>

          <div className="space-y-5 text-sm text-blue-100">

            <div className="flex gap-3">

              <MapPin
                size={18}
                className="mt-1 shrink-0"
              />

              <p>
                Mangalore, Karnataka, India
              </p>

            </div>

            <div className="flex gap-3">

              <Phone
                size={18}
                className="mt-1 shrink-0"
              />

              <p>
                +91 98765 43210
              </p>

            </div>

            <div className="flex gap-3">

              <Mail
                size={18}
                className="mt-1 shrink-0"
              />

              <p>
                vyoma@gmail.com
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM BAR */}

      <div
        className="
          border-t
          border-white/10
          py-5
          px-6
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-3
            text-sm
            text-blue-100
          "
        >

          <p>
            © {new Date().getFullYear()} VYOMA Marketplace.
            All rights reserved.
          </p>

          <p>
            Built with ❤️ in Karnataka
          </p>

        </div>

      </div>

    </footer>

  );
};

export default Footer;