import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Offers } from '../components/Offers';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Offers />
        <Menu />
      </main>
      <Footer />
    </>
  );
}
