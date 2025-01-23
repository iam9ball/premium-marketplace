
import Container from "./components/Container";
import About from "./components/landingPage/About";
import GradientBackground from "./components/landingPage/GradientBackground";
import NavBar from "./components/landingPage/NavBar";


export default function Home() {
  return (
      <>
        <section className="bg-gradient-animated bg-gradient-400 animate-gradient">
           <header>
          <NavBar/>
          </header>
        <Container>
          <About/>  
        </Container>
        </section> 
        <section className="min-h-[980px] scrollbar-hide bg-[#080A0F] relative overflow-hidden">
          <GradientBackground/>
        </section>

      </>
  );
}

