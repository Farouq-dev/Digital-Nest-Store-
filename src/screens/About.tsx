import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <section className="py-16">
      <div className="container max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-foreground text-center">About Digital Nest</h1>
        <div className="mt-8 space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
          <p>
            Welcome to Digital Nest! We are passionate about helping people access high-quality digital products in one convenient place. From ebooks and courses to templates and creative resources, our goal is to provide tools that make learning, creating, and growing easier for everyone.
          </p>
          <p>
            We carefully review every product before it goes on our store to ensure quality and usefulness. Our mission is to make digital products accessible, reliable, and easy to use for people around the world.
          </p>
          <p>
            Thank you for choosing Digital Nest — your trusted source for digital resources!
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
