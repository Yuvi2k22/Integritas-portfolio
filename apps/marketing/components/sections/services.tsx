"use client";
import React from "react";
import { Carousel, Card } from "~/components/ui/apple-cards-carousel";

export function Services() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-20">
            <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
                Our Services
            </h2>
            <Carousel items={cards} />
        </div>
    );
}

const ServiceContent = ({ description, image }: { description: string, image: string }) => {
    return (
        <>
            <div
                className="bg-[#F5F5F7] dark:bg-neutral-800 p-4 md:p-8 rounded-3xl mb-2"
            >
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                    <span className="font-bold text-neutral-700 dark:text-neutral-200">
                        {description.split('.')[0]}.
                    </span>{" "}
                    {description.split('.').slice(1).join('.')}
                </p>
                <img
                    src={image}
                    alt="Service illustration"
                    height="300"
                    width="500"
                    className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-4"
                />
            </div>
        </>
    );
};

const data = [
    {
        category: "Web",
        title: "High-Performance Websites",
        src: "/services-website.png",
        content: <ServiceContent
            description="We build stunning, high-performance websites that capture your brand's essence. From landing pages to complex corporate sites, our designs are responsive, SEO-optimized, and built to convert visitors into customers."
            image="/services-website.png"
        />,
    },
    {
        category: "SaaS",
        title: "Scalable Web Applications",
        src: "/services-webapp.png",
        content: <ServiceContent
            description="Scalable and robust web applications tailored to your specific business needs. We leverage modern frameworks to create intuitive dashboards, portals, and tools that streamline your operations and boost productivity."
            image="/services-webapp.png"
        />,
    },
    {
        category: "Mobile",
        title: "Native iOS & Android Apps",
        src: "/services-mobile.png",
        content: <ServiceContent
            description="Engage your users on the go with native and cross-platform mobile applications. We design and develop seamless experiences for iOS and Android that are fast, reliable, and user-friendly."
            image="/services-mobile.png"
        />,
    },
    {
        category: "Commerce",
        title: "Converting Online Stores",
        src: "/services-ecommerce.png",
        content: <ServiceContent
            description="Launch your online store with confidence. We create custom ecommerce solutions that provide exceptional shopping experiences, secure payments, and easy inventory management to maximize your sales."
            image="/services-ecommerce.png"
        />,
    },
    {
        category: "Enterprise",
        title: "Complete SaaS Platforms",
        src: "/services-saas.png",
        content: <ServiceContent
            description="Transform your innovative ideas into market-ready SaaS platforms. We handle end-to-end development, from architecture design to cloud-native deployment, ensuring scalability and security."
            image="/services-saas.png"
        />,
    },
];
