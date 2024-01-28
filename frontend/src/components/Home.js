import React, { useState, useEffect } from "react";
import feature1 from "../images/feature1.png";
import feature2 from "../images/feature2.png";
import feature3 from "../images/feature3.png";

const Home = () => {
  const features = [
    {
      text: "Compare prices of different products across a multitude of websites.",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit congue purus, eget vulputate tortor rhoncus vel. Nunc convallis diam quis erat dapibus, sit amet molestie ex vestibulum.",
      imageUrl: feature1,
    },
    {
      text: "Bookmark products of interest. Receive notifications when a better deal or discount surfaces.",
      details:
        "Suspendisse maximus sit amet lacus mattis tristique. Cras ornare lacus id molestie ullamcorper. Fusce a purus quam.",
      imageUrl: feature2,
    },
    {
      text: "Search, sort, and filter through a wide range of products.",
      details:
        "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus non ornare arcu.",
      imageUrl: feature3,
    },
  ];

  const testimonials = [
    {
      comment:
        "TechShoppers has been a game-changer for me! The intuitive interface and real-time price updates make it a breeze to find the best deals on tech products. The comprehensive comparisons have saved me both time and money. Highly recommended for anyone looking to make informed tech purchases!",
      username: "Lynna Sewill",
    },
    {
      comment:
        "TechShoppers is my go-to destination for tech deals. The website's clean design and user-friendly layout make it easy to navigate. I love how it provides detailed information and price comparisons on a wide range of gadgets. It's like having a personal tech advisor at my fingertips!",
      username: "Mariana Ezzle",
    },
    {
      comment:
        "Discovering TechShoppers was a revelation! The ability to compare prices across various platforms is a game-changer for someone like me who loves a good deal. The notifications for price drops have saved me a significant amount on my recent purchases. TechShoppers is a must-have tool for any savvy shopper!",
      username: "Luigi Cotsford",
    },
  ];

  return (
    <div className="mx-auto p-8">
      {/* Features Section */}
      <section className="mb-8 scroll-smooth">
        <h2 className="text-4xl font-bold mb-4 text-center">Welcome</h2>
        <div className="border-b-2 border-red-500 mb-8"></div>

        <div className="flex flex-col items-center space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${index % 2 === 0 ? "sm:flex-row-reverse" : ""} border-4 rounded-lg shadow-lg`}
            >
              <div className="flex flex-col justify-between space-y-2">
                <p className="text-4xl text-left p-4 underline decoration-indigo-500 decoration-2 underline-offset-4">
                  {feature.text}
                </p>
                <p className="text-lg text-left px-4 py-2">{feature.details}</p>
              </div>
              <img
                src={feature.imageUrl}
                alt={`Feature ${index + 1}`}
                className="w-auto h-auto p-4"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="widescreen:section-min-height tallscreen:section-min-height my-12 scroll-mt-20 p-6"
      >
        <h2 className="text-4xl font-bold mb-4 text-center">Testimonials</h2>
        <div className="border-b-2 border-red-500 mb-8"></div>
        {testimonials.map((testimonial, index) => (
          <figure key={index} className="my-12">
            <blockquote className="relative rounded-3xl bg-teal-400 py-12 pl-14 pr-8 dark:bg-black">
              <p className="mt-2 text-left text-2xl text-black before:absolute before:top-0 before:left-0 before:translate-x-2 before:translate-y-2 before:transform before:font-serif before:text-9xl before:text-white before:opacity-25 before:content-['\201C'] after:absolute after:-bottom-20 after:right-0 after:-translate-x-2 after:-translate-y-2 after:transform after:font-serif after:text-9xl after:text-white after:opacity-25 after:content-['\201D'] dark:text-slate-400 sm:text-3xl">
                {testimonial.comment}
              </p>
            </blockquote>
            <figcaption className="mt-2 text-right text-xl italic text-slate-500 dark:text-slate-400 sm:text-2xl">
              &#8212;{testimonial.username}
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Contact Us Section */}
      <section
        id="contact"
        className="widescreen:section-min-height tallscreen:section-min-height my-12 scroll-mt-16 p-6"
      >
        <h2 className="text-4xl font-bold mb-4 text-center">Contact Us</h2>
        <div className="border-b-2 border-red-500 mb-8"></div>
        <form
          action=""
          className="items-left mx-auto flex max-w-4xl flex-col gap-4 text-2xl sm:text-3xl"
        >
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            minLength="3"
            maxLength="60"
            placeholder="Your Subject"
            className="w-full rounded-xl border border-solid border-slate-900 p-3 text-2xl text-black dark:border-none sm:text-3xl"
          />
          <label htmlFor="message">Message:</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            placeholder="Your Message"
            required
            className="w-full rounded-xl border border-solid border-slate-900 p-3 text-2xl text-black dark:border-none sm:text-3xl"
          ></textarea>
          <button className="w-48 rounded-xl border border-solid border-slate-900 bg-teal-700 p-3 text-white hover:bg-teal-600 active:bg-teal-500 dark:border-none">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
