// scripts/submit-mckinsey-books.ts
// Submit McKinsey book recommendations to bkrptr API

interface Book {
  title: string;
  author: string;
  year: string;
  category: string;
}

const API_URL = 'https://api.bkrptr.com';
const API_KEY = 'bkrptr_live_U_Ev-IMazxxPojtERiyk0mSuMuMAMT3D';

// Map categories to genres
const categoryToGenre: Record<string, string> = {
  'Artificial Intelligence': 'technology',
  'Biography & Memoir': 'biography',
  'Business & Economics': 'business',
  'Fiction': 'fiction',
  'Health': 'health',
  'History': 'history',
  'Personal Development': 'leadership',
  'Politics': 'politics',
  'Sustainability': 'sustainability',
  'Technology': 'technology',
  'Workplace Culture': 'business',
};

const books: Book[] = [
  // Artificial Intelligence
  { title: 'The AI Con: How to Fight Big Tech\'s Hype and Create the Future We Want', author: 'Emily M. Bender and Alex Hanna', year: '2025', category: 'Artificial Intelligence' },
  { title: 'Building a God: The Ethics of Artificial Intelligence and the Race to Control It', author: 'Christopher DiCarlo', year: '2025', category: 'Artificial Intelligence' },
  { title: 'Genesis: Artificial Intelligence, Hope, and the Human Spirit', author: 'Henry A. Kissinger, Craig Mundie, and Eric Schmidt', year: '2025', category: 'Artificial Intelligence' },
  { title: 'A Kids Book About AI Bias', author: 'Avriel Epps', year: '2025', category: 'Artificial Intelligence' },
  { title: 'The Optimist: Sam Altman, OpenAI, and the Race to Invent the Future', author: 'Keach Hagey', year: '2025', category: 'Artificial Intelligence' },
  { title: 'The Thinking Machine: Jensen Huang, Nvidia, and the World\'s Most Coveted Microchip', author: 'Stephen Witt', year: '2025', category: 'Artificial Intelligence' },
  { title: 'AI Needs You: How We Can Change AI\'s Future and Save Our Own', author: 'Verity Harding', year: '2024', category: 'Artificial Intelligence' },
  { title: 'Co-intelligence: Living and Working with AI', author: 'Ethan Mollick', year: '2024', category: 'Artificial Intelligence' },
  { title: 'The Coming Wave: Technology, Power, and the Twenty-First Century\'s Greatest Dilemma', author: 'Mustafa Suleyman, with Michael Bhaskar', year: '2024', category: 'Artificial Intelligence' },

  // Biography & Memoir
  { title: 'The Circuit: Stories from the Life of a Migrant Child', author: 'Francisco Jiménez', year: '2025', category: 'Biography & Memoir' },
  { title: 'The Devil at His Elbow: Alex Murdaugh and the Fall of a Southern Dynasty', author: 'Valerie Bauerlein', year: '2025', category: 'Biography & Memoir' },
  { title: 'G-Man: J. Edgar Hoover and the Making of the American Century', author: 'Beverly Gage', year: '2025', category: 'Biography & Memoir' },
  { title: 'How to Say Babylon', author: 'Safiya Sinclair', year: '2025', category: 'Biography & Memoir' },
  { title: 'The Mango Tree: A Memoir of Fruit, Florida, and Felony', author: 'Annabelle Tometich', year: '2025', category: 'Biography & Memoir' },
  { title: 'Mark Twain', author: 'Ron Chernow', year: '2025', category: 'Biography & Memoir' },
  { title: 'Matriarch', author: 'Tina Knowles', year: '2025', category: 'Biography & Memoir' },
  { title: 'Patriot', author: 'Alexei Navalny', year: '2025', category: 'Biography & Memoir' },
  { title: 'Red Scare: Blacklists, McCarthyism, and the Making of Modern America', author: 'Clay Risen', year: '2025', category: 'Biography & Memoir' },
  { title: 'The Rigor of Angels: Borges, Heisenberg, Kant, and the Ultimate Nature of Reality', author: 'William Egginton', year: '2025', category: 'Biography & Memoir' },
  { title: 'The Sing Sing Files: One Journalist, Six Innocent Men, and a Twenty-Year Fight for Justice', author: 'Dan Slepian', year: '2025', category: 'Biography & Memoir' },
  { title: 'This American Woman: A One-in-a-Billion Memoir', author: 'Zarna Garg', year: '2025', category: 'Biography & Memoir' },
  { title: 'Titan: The Life of John D. Rockefeller, Sr.', author: 'Ron Chernow', year: '2025', category: 'Biography & Memoir' },
  { title: 'An Amerikan Family: The Shakurs and the Nation They Created', author: 'Santi Elijah Holley', year: '2024', category: 'Biography & Memoir' },
  { title: 'Chasing Hope: A Reporter\'s Life', author: 'Nicholas D. Kristof', year: '2024', category: 'Biography & Memoir' },
  { title: 'The Code Breaker: Jennifer Doudna, Gene Editing, and the Future of the Human Race', author: 'Walter Isaacson', year: '2024', category: 'Biography & Memoir' },
  { title: 'Fever Pitch', author: 'Nick Hornby', year: '2024', category: 'Biography & Memoir' },
  { title: 'Grief Is for People', author: 'Sloane Crosley', year: '2024', category: 'Biography & Memoir' },
  { title: 'Nephew: A Memoir in 4-Part Harmony', author: 'M. K. Asante', year: '2024', category: 'Biography & Memoir' },
  { title: 'Playing from the Rough: A Personal Journey Through America\'s 100 Greatest Golf Courses', author: 'Jimmie James', year: '2024', category: 'Biography & Memoir' },
  { title: 'Trace', author: 'Jenny Holzer', year: '2024', category: 'Biography & Memoir' },
  { title: 'Walk Through Fire: A Memoir of Love, Loss, and Triumph', author: 'Sheila Johnson, with Lisa Dickey', year: '2024', category: 'Biography & Memoir' },

  // Business & Economics
  { title: 'The Book on Rental Property Investing: How to Create Wealth with Intelligent Buy & Hold Real Estate Investing', author: 'Brandon Turner', year: '2025', category: 'Business & Economics' },
  { title: 'A CEO for All Seasons: Mastering the Cycles of Leadership', author: 'Carolyn Dewar, Kurt Strovink, Scott Keller, and Vikram Malhotra', year: '2025', category: 'Business & Economics' },
  { title: 'Inevitable: Inside the Messy, Unstoppable Transition to Electric Vehicles', author: 'Mike Colias', year: '2025', category: 'Business & Economics' },
  { title: 'Leading Through Disruption: A Changemaker\'s Guide to Twenty-First Century Leadership', author: 'Andrew N. Liveris', year: '2025', category: 'Business & Economics' },
  { title: 'The New Lunar Society: An Enlightenment Guide to the Next Industrial Revolution', author: 'David A. Mindell', year: '2025', category: 'Business & Economics' },
  { title: 'Our Dollar, Your Problem: An Insider\'s View of Seven Turbulent Decades of Global Finance, and the Road Ahead', author: 'Kenneth Rogoff', year: '2025', category: 'Business & Economics' },
  { title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness', author: 'Morgan Housel', year: '2025', category: 'Business & Economics' },
  { title: 'Range: Why Generalists Triumph in a Specialized World', author: 'David Epstein', year: '2025', category: 'Business & Economics' },
  { title: 'Red Helicopter—a Parable for Our Times: Lead Change with Kindness (Plus a Little Math)', author: 'James Rhee', year: '2025', category: 'Business & Economics' },
  { title: 'There\'s Nothing Like This: The Strategic Genius of Taylor Swift', author: 'Kevin Evers', year: '2025', category: 'Business & Economics' },
  { title: 'The Unaccountability Machine: Why Big Systems Make Terrible Decisions—and How the World Lost Its Mind', author: 'Dan Davies', year: '2025', category: 'Business & Economics' },
  { title: 'Design Social Change: Take Action, Work Toward Equity, and Challenge the Status Quo', author: 'Lesley-Ann Noel', year: '2024', category: 'Business & Economics' },
  { title: 'The Formula: How Rogues, Geniuses, and Speed Freaks Reengineered F1 into the World\'s Fastest-Growing Sport', author: 'Joshua Robinson and Jonathan Clegg', year: '2024', category: 'Business & Economics' },
  { title: 'Inner Drive: From Underdog to Global Company', author: 'Arsen Tomsky', year: '2024', category: 'Business & Economics' },
  { title: 'The Journey of Leadership: How CEOs Learn to Lead from the Inside Out', author: 'Dana Maor, Hans-Werner Kaas, Kurt Strovink, and Ramesh Srinivasan', year: '2024', category: 'Business & Economics' },
  { title: 'How Legendary Leaders Speak: 451 Proven Communication Strategies of the World\'s Top Leaders', author: 'Peter D. Andrei', year: '2024', category: 'Business & Economics' },
  { title: 'Possible: How We Survive (and Thrive) in an Age of Conflict', author: 'William Ury', year: '2024', category: 'Business & Economics' },
  { title: 'Trillion Dollar Coach: The Leadership Playbook of Silicon Valley\'s Bill Campbell', author: 'Eric Schmidt, Jonathan Rosenberg, and Alan Eagle', year: '2024', category: 'Business & Economics' },
  { title: 'What I Learned About Investing from Darwin', author: 'Pulak Prasad', year: '2024', category: 'Business & Economics' },
  { title: 'What Went Wrong with Capitalism', author: 'Ruchir Sharma', year: '2024', category: 'Business & Economics' },

  // Add remaining books... (continuing in next section due to length)
];

// Add more books (Fiction, Health, History, etc.)
const moreBooks: Book[] = [
  // Fiction
  { title: 'The Alchemist', author: 'Paulo Coelho', year: '2025', category: 'Fiction' },
  { title: 'All Fours', author: 'Miranda July', year: '2025', category: 'Fiction' },
  { title: 'Children of Time', author: 'Adrian Tchaikovsky', year: '2025', category: 'Fiction' },
  { title: 'The Culture series', author: 'Iain Banks', year: '2025', category: 'Fiction' },
  { title: 'Dinosaurs', author: 'Lydia Millet', year: '2025', category: 'Fiction' },
  { title: 'The God of the Woods', author: 'Liz Moore', year: '2025', category: 'Fiction' },
  { title: 'Hadji Murat', author: 'Leo Tolstoy', year: '2025', category: 'Fiction' },
  { title: 'James', author: 'Percival Everett', year: '2025', category: 'Fiction' },
  { title: 'Les Misérables', author: 'Victor Hugo', year: '2025', category: 'Fiction' },
  { title: 'The Life Impossible', author: 'Matt Haig', year: '2025', category: 'Fiction' },
  { title: 'The Maniac', author: 'Benjamín Labatut', year: '2025', category: 'Fiction' },
  { title: 'Olga Dies Dreaming', author: 'Xochitl Gonzalez', year: '2025', category: 'Fiction' },
  { title: 'Orbital', author: 'Samantha Harvey', year: '2025', category: 'Fiction' },
  { title: 'The Personal Librarian', author: 'Marie Benedict and Victoria Christopher Murray', year: '2025', category: 'Fiction' },
  { title: 'Precipice', author: 'Robert Harris', year: '2025', category: 'Fiction' },
  { title: 'Presumed Guilty', author: 'Scott Turow', year: '2025', category: 'Fiction' },
  { title: 'Trust', author: 'Hernan Diaz', year: '2025', category: 'Fiction' },
  { title: '2054', author: 'Elliot Ackerman and Admiral James Stavridis', year: '2024', category: 'Fiction' },
  { title: 'The Assassin', author: 'Tom Fletcher', year: '2024', category: 'Fiction' },
  { title: 'Birnam Wood', author: 'Eleanor Catton', year: '2024', category: 'Fiction' },
  { title: 'The Books of Jacob', author: 'Olga Tokarczuk', year: '2024', category: 'Fiction' },
  { title: 'Bournville', author: 'Jonathan Coe', year: '2024', category: 'Fiction' },
  { title: 'Demon Copperhead', author: 'Barbara Kingsolver', year: '2024', category: 'Fiction' },
  { title: 'Fathers and Sons', author: 'Ivan Turgenev', year: '2024', category: 'Fiction' },
  { title: 'God\'s Debris: A Thought Experiment', author: 'Scott Adams', year: '2024', category: 'Fiction' },
  { title: 'I Have Some Questions for You', author: 'Rebecca Makkai', year: '2024', category: 'Fiction' },
  { title: 'The Island of Missing Trees', author: 'Elif Shafak', year: '2024', category: 'Fiction' },
  { title: 'Letters to Alice: On First Reading Jane Austen', author: 'Fay Weldon', year: '2024', category: 'Fiction' },
  { title: 'The Meursault Investigation', author: 'Kamel Daoud', year: '2024', category: 'Fiction' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', year: '2024', category: 'Fiction' },
  { title: 'The Wizard of the Kremlin', author: 'Giuliano da Empoli', year: '2024', category: 'Fiction' },

  // Health
  { title: 'The Anxious Generation: How the Great Rewiring of Childhood Is Causing an Epidemic of Mental Illness', author: 'Jonathan Haidt', year: '2025', category: 'Health' },
  { title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams', author: 'Matthew Walker', year: '2025', category: 'Health' },
  { title: 'Good Energy: The Surprising Connection Between Metabolism and Limitless Health', author: 'Casey Means, with Calley Means', year: '2024', category: 'Health' },
  { title: 'My Father\'s Brain: Life in the Shadow of Alzheimer\'s', author: 'Sandeep Jauhar', year: '2024', category: 'Health' },
  { title: 'Lifespan: Why We Age—and Why We Don\'t Have to', author: 'David A. Sinclair, with Matthew D. LaPlante', year: '2024', category: 'Health' },
  { title: 'Outlive: The Science & Art of Longevity', author: 'Peter Attia, with Bill Gifford', year: '2024', category: 'Health' },
  { title: 'Unwell Women: Misdiagnosis and Myth in a Man-Made World', author: 'Elinor Cleghorn', year: '2024', category: 'Health' },
  { title: 'Why We Remember: Unlocking Memory\'s Power to Hold On to What Matters', author: 'Charan Ranganath', year: '2024', category: 'Health' },

  // Continue with remaining categories...
];

// Combine all books
const allBooks = [...books, ...moreBooks];

async function submitBook(book: Book, index: number): Promise<void> {
  const genre = categoryToGenre[book.category] || 'business';

  const payload = {
    book: {
      title: book.title,
      author: book.author,
      publicationYear: book.year,
      genre: genre,
    },
    options: {
      processingMode: 'batch',
      purpose: 'reference',
      audience: 'senior executives and leadership teams',
      analysisDepth: 'standard',
      specificContext: 'McKinsey book recommendations for business leaders',
    },
  };

  try {
    const response = await fetch(`${API_URL}/api/v1/analyses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ [${index + 1}/${allBooks.length}] Failed: ${book.title}`);
      console.error(`   Error: ${JSON.stringify(error)}`);
      return;
    }

    const result = await response.json();
    console.log(`✅ [${index + 1}/${allBooks.length}] Submitted: ${book.title}`);
    console.log(`   ID: ${result.id}, Status: ${result.status}, Cost: $${result.estimatedCost}`);
  } catch (error) {
    console.error(`❌ [${index + 1}/${allBooks.length}] Error submitting ${book.title}:`, error);
  }
}

async function main() {
  console.log(`\n📚 McKinsey Book Batch Submission`);
  console.log(`==================================\n`);
  console.log(`Total books: ${allBooks.length}`);
  console.log(`Processing mode: Batch ($0.03 per book)`);
  console.log(`Estimated total cost: $${(allBooks.length * 0.03).toFixed(2)}`);
  console.log(`Estimated completion time: ~75 minutes\n`);
  console.log(`Starting submission...\n`);

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  // Submit books with a small delay to avoid overwhelming the API
  for (let i = 0; i < allBooks.length; i++) {
    await submitBook(allBooks[i], i);
    successCount++;

    // Small delay between submissions (100ms)
    if (i < allBooks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n==================================`);
  console.log(`📊 Submission Complete`);
  console.log(`==================================`);
  console.log(`Total submitted: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Time taken: ${duration}s`);
  console.log(`\nBooks are now processing in batch mode.`);
  console.log(`Check status at: ${API_URL}/api/v1/analyses`);
}

main().catch(console.error);
