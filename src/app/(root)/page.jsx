import { ModeToggle } from "@/components/ui/mode-toggle"

function HomePage() {
  return (
    <div>
      HomePage
      <ModeToggle />
    </div>
  )
}
export default HomePage

//TODO:
// Ändra så att varje task har en deadline (Ha bara med range i add-task-form?)
// Ändra hela projektets namn till workhandler
// Connecta till rätt databas och se till att allt funkar
// Se till att hela projektet är på engelska
// Ändra styling så den ser lite annorlunda ut än Joakims
// Ta bort andra ev funktioner som inte är krav för uppgiften



// Krav för godkänt (G):

// Next.js: Projektet ska byggas i Next.js med App Router. - OK

// Autentisering: Det ska gå att autensiera en användare med en färdig Auth-tjänst (t.ex. firebase, clerk etc) 
// och man ska vara tvungen att logga in för att komma åt sidan. - 

// Rollbaserad åtkost: Bara en administratör ska kunna lägga till uppgifter till användare. - 

// Uppgifter: Användare av systemet kan se och klarmarkera sina egna arbetsuppgifter.

// Deadline: Varje uppgift ska ha en deadline.

// Datalagring: Data för uppgifter lagras i en BaaS (Backend as a Service) t.ex. Firebase, Convex, Supabase eller liknande). - OK

// Responsivitet: Sidan ska ha responsiv design - OK


// Krav för väl godkänt (VG):
// (Förutom kraven för godkänt ska ni även göra:)

// Dashboard: En admin ska kunna se dashboard med kolumnvy för ALLA användares uppgifter, samt kunna klarmarkera dessa där.

// Realtidsuppdateringar: Om en uppgift läggs till eller klarmarkeras ska dessa återspeglas i realtid på dashboard sidan.

// Test: Du ska ha minst ett enkelt enhetstest - OK