export type JournalCategory =
  | "the-unsaid"
  | "afterimage"
  | "objects-and-traces"
  | "research-notes"
  | "field-notes"
  | "letters-never-sent"
  | "small-rituals";

export interface JournalSource {
  title: string;
  authors: string;
  year: number;
  publication?: string;
  doiOrUrl?: string;
}

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  entryNumber: string; // e.g. "NO. 0001"
  category: JournalCategory;
  seriesName: string;
  date: string;
  readingTime: string; // "3 min", "5 min", "7 min", "8 min", etc.
  depth: "brief" | "medium" | "deep"; // brief: <=4m, medium: 5-8m, deep: >=9m
  palette: string; // matching ARCHIVAL_PALETTES e.g. "deep-blue", "dusty-rose", "warm-parchment", "sage", etc.
  excerpt: string;
  paragraphs: string[];
  pullQuote?: {
    text: string;
    attribution?: string;
  };
  researchContext?: {
    finding: string;
    sources: JournalSource[];
  };
  tags: string[];
  relatedSlugs: string[];
  archiveEmotionFilter?: string; // e.g. "LONGING", "REGRET", "LOVE", "MEMORY", "GRIEF"
  isFeatured?: boolean;
}

export const JOURNAL_CATEGORIES: { id: JournalCategory; label: string; description: string }[] = [
  {
    id: "the-unsaid",
    label: "The Unsaid",
    description: "Substantial essays on conversational hesitation, swallowed truths, and the social physics of silence.",
  },
  {
    id: "afterimage",
    label: "Afterimage",
    description: "Studies on memory, nostalgia, temporal distance, and the versions of ourselves that only existed with someone else.",
  },
  {
    id: "objects-and-traces",
    label: "Objects & Traces",
    description: "The material culture of longing: receipts, abandoned keys, ghost coordinates, and digital detritus.",
  },
  {
    id: "research-notes",
    label: "Research Notes",
    description: "Empirical investigations into cognitive science, linguistics, self-distancing, and emotional disclosure.",
  },
  {
    id: "field-notes",
    label: "Field Notes",
    description: "Short street-level observations, overheard sentences, railway platforms, and late-night domestic fragments.",
  },
  {
    id: "letters-never-sent",
    label: "Letters Never Sent",
    description: "Literary examinations of unsent correspondence, letters to past and future selves, and phantom dialogue.",
  },
  {
    id: "small-rituals",
    label: "Small Rituals",
    description: "Private human habits used to mark endings, process grief, keep secrets, and create personal closure.",
  },
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  // =========================================================================
  // 1. THE UNSAID (Essays)
  // =========================================================================
  {
    id: "unsaid-01",
    slug: "the-message-you-rehearsed-while-walking-home",
    title: "The Message You Rehearsed While Walking Home",
    subtitle: "On the elaborate internal dialogues we stage in empty streets that dissolve the moment someone opens the door.",
    entryNumber: "NO. 0001",
    category: "the-unsaid",
    seriesName: "The Unsaid",
    date: "February 2026",
    readingTime: "6 min",
    depth: "medium",
    palette: "deep-blue",
    isFeatured: true,
    excerpt:
      "There is a particular acoustic quality to the speech we prepare when walking down a cold street alone. Every clause arrives with devastating clarity. And yet, the moment the recipient's face appears, the entire architecture turns into water.",
    paragraphs: [
      "There is a particular acoustic quality to the speech we prepare when walking down a cold street alone. Every clause arrives with devastating clarity. We calibrate our tone, anticipate the interruptions, insert the exact pauses where dignity ought to reside, and deliver an address that would convince any court of human conscience. We are articulate because the listener is an imagined one, endowed with total attentiveness and no unpredictable responses.",
      "And yet, within three paces of the actual door, the entire architecture turns into water. When the recipient actually appears—distracted, holding a tea mug, glancing up from a phone—the speech collapses into something pathetic: 'Did you get the milk?' or 'It’s colder than yesterday.'",
      "Psychologists who study what Erving Goffman termed 'remedial interchanges' understand that rehearsal in solitary motion is rarely an attempt to communicate. It is an attempt to inhabit an uninjured version of oneself. In the safety of the dark pavement, you are neither hurried nor misunderstood. You are simply stating what happened to you.",
      "The unsaid message is almost always a hostage situation of timing. The window for speaking honestly rarely lasts longer than twelve seconds: right after someone takes off their coat, or just before the elevator bell chimes. Once that window closes, the speech goes back into the coat pocket, where it accumulates lint and historical weight.",
      "To leave a sentence unsaid is rarely an act of cowardice. More often, it is an act of preservation. We recognize that the spoken sentence is an irreversible chemical agent—once poured into the room, it alters the nitrogen balance between two bodies forever. The unsaid words allow the room to stay the same temperature for one more evening.",
    ],
    pullQuote: {
      text: "The spoken sentence is an irreversible chemical agent. Once poured into the room, it alters the nitrogen balance between two bodies forever.",
    },
    tags: ["Hesitation", "Proximity", "Silence", "Walking"],
    relatedSlugs: [
      "why-silence-is-loudest-in-small-rooms",
      "the-afterlife-of-a-deleted-draft",
      "field-note-the-sound-of-dishwashing-in-an-argument",
    ],
    archiveEmotionFilter: "LONGING",
  },
  {
    id: "unsaid-02",
    slug: "on-forgiving-people-who-will-never-know",
    title: "On Forgiving People Who Will Never Know",
    subtitle: "How an anonymous sentence, left on digital paper, can close a decade-long wound without requiring the other party to understand.",
    entryNumber: "NO. 0002",
    category: "the-unsaid",
    seriesName: "The Unsaid",
    date: "January 2026",
    readingTime: "7 min",
    depth: "medium",
    palette: "warm-parchment",
    excerpt:
      "We are taught that forgiveness is an exchange—a contract signed across a coffee table. But the most durable forms of release occur in total unilateral secrecy, where the person who caused the scar is never invited to inspect the bandage.",
    paragraphs: [
      "We are taught by narrative culture that forgiveness is an exchange: a dialogue conducted across a sunlit kitchen table, followed by an embrace and the gentle fading of a cello score. In real life, attempting to extract an apology from the person who hurt you is usually like trying to cash a check at a bank that burned down eight years ago.",
      "The people who cause our deepest fractures are almost never equipped to comprehend the fracture. To expect them to validate your pain is to ask the person who accidentally dropped the vase to explain the physics of porcelain. They didn’t see the vase; they only heard a crash while walking out the door.",
      "The most durable forms of release occur in unilateral secrecy. When someone writes into this archive, 'I misunderstood you, but I forgive you anyway,' they are not mailing a bill. They are performing an eviction. They are deciding that the squatter in their memory has occupied prime interior real estate for too long without paying rent.",
      "In unilateral forgiveness, the other party remains completely ignorant of their pardon. They continue through their lives—buying groceries, getting into fender-benders, aging—wholly unaware that twenty miles away or across an ocean, an indictment against them was quietly expunged from the docket at 2:00 in the morning.",
      "There is immense dignity in that quietness. It proves that peace was never in their hands to give. It was yours to claim the moment you stopped waiting for them to grow into someone capable of remorse.",
    ],
    pullQuote: {
      text: "To expect an apology from the person who hurt you is like trying to cash a check at a bank that burned down eight years ago.",
    },
    tags: ["Forgiveness", "Resolution", "Letting Go", "Unilateral Peace"],
    relatedSlugs: [
      "some-people-exist-only-in-the-past-tense",
      "the-geography-of-the-almost",
      "research-note-when-expressive-writing-fails",
    ],
    archiveEmotionFilter: "REGRET",
  },
  {
    id: "unsaid-03",
    slug: "the-geography-of-the-almost",
    title: "The Geography of the Almost",
    subtitle: "Why unconsummated relationships resist closure with far greater stubbornness than relationships that actually ended.",
    entryNumber: "NO. 0003",
    category: "the-unsaid",
    seriesName: "The Unsaid",
    date: "December 2025",
    readingTime: "8 min",
    depth: "medium",
    palette: "dusty-rose",
    excerpt:
      "A completed relationship leaves behind evidence: broken dishes, shared leases, the memory of arguments over tax returns. An 'almost' leaves behind only pure hypothetical potential, which is indestructible because it was never tested against reality.",
    paragraphs: [
      "A relationship that ran its full course leaves behind forensic evidence. You know how they chewed when they were tired; you know the small, petty irritations that cropped up during a four-hour road trip; you know how they acted when the WiFi went out. The dream was tested against the brutal friction of ordinary Tuesday mornings, and it broke where all human things break.",
      "An 'almost'—the friendship that stood on the edge of a balcony for one summer, the colleague with whom you exchanged eight hundred oblique jokes over email, the train seat companion you talked to between Berlin and Prague—leaves behind no such debris. Because it was never grounded in laundry and grocery lists, it remains permanently pristine.",
      "Psychologically, what resists closure in the 'almost' is not the person, but the infinite subjunctive tense. In the grammatical study of regret, the conditional tense ('what would have happened if I reached across the console') possesses an infinite half-life. Reality has boundaries; potential has none.",
      "When we archive messages addressed to an 'almost', they are consistently the most tender and the most irrational. The writer is mourning a phantom limb. You cannot fall out of love with a ghost because the ghost never forgot your birthday or left the stove on. It only ever did what you imagined it doing.",
      "To recover from an almost requires mourning an event that never took place. It requires looking at an empty doorway and admitting that the person walking through it was only ever a projection of your own loneliness.",
    ],
    pullQuote: {
      text: "Reality has boundaries; potential has none. You cannot fall out of love with a ghost because the ghost never left the stove on.",
    },
    tags: ["Longing", "Potential", "Subjunctive Grief", "Memory"],
    relatedSlugs: [
      "the-message-you-rehearsed-while-walking-home",
      "on-missing-someone-you-dont-want-back",
      "letters-written-across-ten-years",
    ],
    archiveEmotionFilter: "LONGING",
  },
  {
    id: "unsaid-04",
    slug: "why-silence-is-loudest-in-small-rooms",
    title: "Why Silence Is Loudest in Small Rooms",
    subtitle: "Proxemics, physical proximity, and why speaking a hard truth across a narrow kitchen table feels physically hazardous.",
    entryNumber: "NO. 0004",
    category: "the-unsaid",
    seriesName: "The Unsaid",
    date: "November 2025",
    readingTime: "5 min",
    depth: "medium",
    palette: "charcoal",
    excerpt:
      "When two people sit three feet apart, silence ceases to be the absence of noise. It turns into a high-pressure meteorological front that makes reaching for the salt cellar feel like defusing a live bomb.",
    paragraphs: [
      "Anthropologist Edward T. Hall, who pioneered the field of proxemics in the 1960s, divided human spatial distances into distinct bands: intimate (0 to 18 inches), personal (1.5 to 4 feet), and social (4 to 12 feet). In the personal band, human eyes can register micro-dilations of pupils and the shallow flutter of a pulse in the clavicle.",
      "This is why a sentence withheld across a kitchen table feels so physically oppressive. When you are sitting opposite someone in an intimate space, the unsaid word has nowhere to dissipate. In a lecture hall or on a beach, a silent thought drifts into the rafters or out to sea. In an eight-by-ten kitchen, it bounces between the refrigerator and the toaster like a radar ping.",
      "People in small rooms develop elaborate choreographies to manage this pressure. They scrape toast. They check the underside of a tea bag. They inspect the expiration date on mustard they purchased yesterday. Every mundane action is a diversionary tactic to prove that the silence is merely domestic, rather than constitutional.",
      "The paradox of proximity is that closeness often makes frankness harder, not easier. When you love someone, you are acutely aware of the exact blast radius of your words. To speak the truth is to set off a grenade in a room where you yourself are standing.",
    ],
    tags: ["Silence", "Proxemics", "Domestic Life", "Atmosphere"],
    relatedSlugs: [
      "the-words-we-swap-for-weather",
      "field-note-the-sound-of-dishwashing-in-an-argument",
      "the-emotional-weight-of-an-abandoned-key",
    ],
    archiveEmotionFilter: "GRIEF",
  },
  {
    id: "unsaid-05",
    slug: "the-words-we-swap-for-weather",
    title: "The Words We Swap for Weather",
    subtitle: "An examination of conversational deflection: the intricate machinery of small talk when both people know the real subject.",
    entryNumber: "NO. 0005",
    category: "the-unsaid",
    seriesName: "The Unsaid",
    date: "October 2025",
    readingTime: "6 min",
    depth: "medium",
    palette: "sage",
    excerpt:
      "Small talk is rarely superficial. In times of crisis, it is a desperate containment vessel. We talk about incoming rainfall not because we care about precipitation, but because talking about the rain prevents us from speaking about the fracture.",
    paragraphs: [
      "We are accustomed to disparaging small talk as the currency of strangers and dental waiting rooms. But anyone who has sat in a hospital waiting area or beside an estranged sibling at a wedding knows that small talk can be an act of desperate structural preservation.",
      "When two people discuss whether the bus was running late or whether the humidity is unusual for October, they are not exchanging meteorology. They are erecting sandbags. Both parties know precisely what water is rising on the other side of the conversational barrier. The weather report is an agreed-upon neutral ground where nobody has to bleed.",
      "Linguists refer to this as phatic communication—speech whose function is not to transmit information, but to confirm social presence without risking vulnerability. 'It’s supposed to drop below forty tonight,' means: 'I acknowledge that we are in the same universe, and I am choosing not to detonate it.'",
      "When someone finally breaks the truce—when they ignore the weather and say, 'Why didn’t you call me when she died?'—the effect is not merely emotional; it is spatial. The sandbags vanish. The flood fills the living room. Often, in that split second before answers are given, both people look at the shattered weather report with quiet, mournful longing.",
    ],
    pullQuote: {
      text: "The weather report is an agreed-upon neutral ground where nobody has to bleed.",
    },
    tags: ["Linguistics", "Deflection", "Small Talk", "Intimacy"],
    relatedSlugs: [
      "why-silence-is-loudest-in-small-rooms",
      "the-message-you-rehearsed-while-walking-home",
      "field-note-platform-4-at-1142-pm",
    ],
    archiveEmotionFilter: "LONGING",
  },

  // =========================================================================
  // 2. AFTERIMAGE (Memory & Time)
  // =========================================================================
  {
    id: "afterimage-01",
    slug: "some-people-exist-only-in-the-past-tense",
    title: "Some People Exist Only in the Past Tense",
    subtitle: "The strange cognitive friction of encountering someone who once knew your childhood secrets but now shares nothing with you.",
    entryNumber: "NO. 0006",
    category: "afterimage",
    seriesName: "Afterimage",
    date: "September 2025",
    readingTime: "5 min",
    depth: "medium",
    palette: "dusty-plum",
    excerpt:
      "You run into someone in an airport terminal who once sat on your bedroom floor listening to albums until 3:00 AM. You exchange four polite sentences about flight delays, and in that moment, time feels like an impossible physical mistake.",
    paragraphs: [
      "There is an uncomfortable vertigo when you cross paths with a person who holds the security clearance to a past version of you that no longer exists. They know the name of your first dog; they remember what you wore to the high school chemistry exam; they know what you sounded like when your voice cracked in the winter of 2014.",
      "Yet here you are, standing beside a carousel in Terminal 2, exchanging updates on flight connections to Chicago. You speak with the guarded, rounded consonants of two diplomats whose nations signed a ceasefire twenty years ago and haven't traded goods since.",
      "The brain struggles to resolve these two files. File A: this person once saw me weep uncontrollably into a bowl of instant soup. File B: this person is wearing a business suit and asking if the baggage claim is on level one. Neither file can overwrite the other.",
      "What we are mourning in those thirty-second airport encounters is not the friendship itself. It is the realization that intimacy has an expiration code, and that someone can hold the keys to your private archive while being permanently barred from the front door.",
    ],
    tags: ["Memory", "Strangers", "Past Selves", "Temporal Distance"],
    relatedSlugs: [
      "the-version-of-you-that-lives-in-someone-elses-memory",
      "on-missing-someone-you-dont-want-back",
      "field-note-old-usernames-as-ghost-identities",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "afterimage-02",
    slug: "the-version-of-you-that-lives-in-someone-elses-memory",
    title: "The Version of You That Lives in Someone Else’s Memory",
    subtitle: "How we remain permanently frozen in the recollections of people we haven't seen in ten years.",
    entryNumber: "NO. 0007",
    category: "afterimage",
    seriesName: "Afterimage",
    date: "August 2025",
    readingTime: "7 min",
    depth: "medium",
    palette: "ochre",
    excerpt:
      "Somewhere in a town you haven't visited since college, an acquaintance still thinks of you as someone who drinks cheap gin and wears an olive-drab army jacket. You are an antique fixture in their mental gallery, frozen at twenty-two.",
    paragraphs: [
      "We walk through our adult lives with the comforting illusion that our identity is a continuous, unified project. We update our resumes, change our haircuts, acquire new tastes in literature, and quietly prune away our youthful embarrassments.",
      "Yet scattered across the geography of the world are hundreds of ghost versions of you, living inside other people's skulls without your consent or supervision. To a girl you dated for six weeks in 2016, you are still the boy who drives a Honda with a broken passenger window and listens to indie rock. To your former landlord, you are the quiet tenant on the third floor who always paid rent three days early in cash.",
      "These ghost avatars never age. They don't have back pain. They don't pay property taxes. They sit frozen in memory like museum specimens preserved under glass. And occasionally, when an old contact sends an unexpected message out of the blue, you realize they are speaking to that museum mannequin, not to the tired person sitting at your desk.",
      "It is a disorienting thought, but also a tender one. In an indifferent universe, our past selves are not completely annihilated. They are simply farmed out to the memories of casual acquaintances who remember us on rainy afternoons.",
    ],
    pullQuote: {
      text: "Scattered across the geography of the world are hundreds of ghost versions of you, living inside other people's skulls without your consent.",
    },
    tags: ["Identity", "Memory", "Ghosts", "Time"],
    relatedSlugs: [
      "some-people-exist-only-in-the-past-tense",
      "nostalgia-for-difficult-years",
      "research-note-autobiographical-reasoning-and-narrative-contamination",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "afterimage-03",
    slug: "nostalgia-for-difficult-years",
    title: "Nostalgia for Difficult Years",
    subtitle: "Why the human mind romanticizes periods of acute loneliness or hardship once they possess the safety of a conclusion.",
    entryNumber: "NO. 0008",
    category: "afterimage",
    seriesName: "Afterimage",
    date: "July 2025",
    readingTime: "6 min",
    depth: "medium",
    palette: "terracotta",
    excerpt:
      "Why do we look back at the studio apartment where we had no money and cried on Thursday nights with such overwhelming tenderness? Because pain with an ending is the only pain we can safely love.",
    paragraphs: [
      "Ask almost anyone to describe their most romanticized era, and surprisingly often they will point to a year when their life was objectively miserable: the first year after a divorce, the semester they lived on dry cereal in a drafty bedsit, or the six months they spent searching for a job in a city where they knew nobody.",
      "While living inside those months, there was nothing romantic about them. The loneliness was abrasive; the anxiety felt permanent; the radiator clanked all night. Yet five years later, hearing a song from that winter evokes an involuntary pang of longing so sharp it feels like homesickness.",
      "Psychologists who study autobiographical memory understand this mechanism: the mind strips away the cortisol of uncertainty. When you were twenty-three and broke, you did not know whether you would ever find work or companionship. Looking back from thirty-five, you possess the supreme luxury of knowing how the chapter ends.",
      "Hardship, once relieved of its open-ended dread, becomes narrative gold. It becomes the trial through which the hero passed. We do not miss the poverty or the heartbreak; we miss the fierce, concentrated clarity of a life stripped down to survival.",
    ],
    tags: ["Nostalgia", "Hardship", "Autobiographical Memory", "Clarity"],
    relatedSlugs: [
      "research-note-nostalgia-as-a-homeostatic-corrective",
      "the-version-of-you-that-lives-in-someone-elses-memory",
      "what-an-old-receipt-can-remember",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "afterimage-04",
    slug: "memory-distortions-and-the-stories-we-protect",
    title: "Memory Distortions and the Stories We Protect",
    subtitle: "How autobiographical memory quietly edits our recollections to preserve our current narrative identity.",
    entryNumber: "NO. 0009",
    category: "afterimage",
    seriesName: "Afterimage",
    date: "June 2025",
    readingTime: "8 min",
    depth: "medium",
    palette: "faded-brick",
    excerpt:
      "Every time you retrieve a memory, you are not opening a file drawer; you are re-baking a loaf of bread. The mind adjusts the ingredients to ensure you remain the protagonist of your own life.",
    paragraphs: [
      "Cognitive neuroscientists have established that memory is not a surveillance tape; it is an act of imaginative reconstruction. Each time an episodic memory is pulled into working memory, its synaptic connections become labile, meaning it can be rewritten, colored by current mood, and resaved with subtle modifications.",
      "In personal relationships, this reconstructive process operates as a ruthless editorial department. If you need to believe that a past relationship was doomed from the beginning, your memory will obligingly amplify the awkward silence in the car on your second date while quietly fading out the three hundred times you laughed until your ribs ached.",
      "This is not dishonesty in the conventional sense. It is psychological immune defense. To hold the contradictory truth—that two people were genuinely magnificent together and yet still failed each other—is exhausting. It is far simpler to write a tidy narrative arc: 'He was always selfish' or 'She never truly understood me.'",
      "When people read through old diaries or unsent messages years later, the shock is almost always how much gentle nuance they erased. The archive serves as an external witness against our own self-serving revisions.",
    ],
    pullQuote: {
      text: "Memory is not a surveillance tape; it is an act of imaginative reconstruction. Each time you retrieve it, you re-bake the loaf.",
    },
    tags: ["Cognition", "Memory Distortion", "Identity", "Diaries"],
    relatedSlugs: [
      "research-note-autobiographical-reasoning-and-narrative-contamination",
      "some-people-exist-only-in-the-past-tense",
      "letters-written-across-ten-years",
    ],
    archiveEmotionFilter: "REGRET",
  },
  {
    id: "afterimage-05",
    slug: "on-missing-someone-you-dont-want-back",
    title: "On Missing Someone You Don’t Want Back",
    subtitle: "Disentangling the craving for an era of your life from the craving for the person who inhabited it.",
    entryNumber: "NO. 0010",
    category: "afterimage",
    seriesName: "Afterimage",
    date: "May 2025",
    readingTime: "5 min",
    depth: "medium",
    palette: "dusty-rose",
    excerpt:
      "You do not want their texts at 7:00 AM. You do not want their laundry on your floor. You do not want to restart the arguments. You simply miss who you were allowed to be when you stood next to them.",
    paragraphs: [
      "There is a peculiar guilt in missing an ex-partner or an estranged friend when you have zero desire to actually be in their presence again. We confuse longing with reconciliation, assuming that because an ache exists, it must be an instruction to reach out.",
      "It is rarely an instruction. What we miss is almost never the person in their full, irritating three-dimensionality. What we miss is the specific frequency of selfhood they unlocked. With them, you were funny in a way nobody else laughed at; with them, you walked through neighborhoods you now have no reason to visit.",
      "When someone leaves your life, an entire wing of your mental palace is locked from the outside. You miss walking down those hallways. You miss the furniture in that room. But you know that if you invited them back through the front door, they would bring the termites with them.",
      "Allow yourself to mourn the wing without calling the landlord. It is entirely permissible to miss an era of your youth while being profoundly grateful that you survived it.",
    ],
    tags: ["Longing", "Boundaries", "Grief", "Selfhood"],
    relatedSlugs: [
      "the-geography-of-the-almost",
      "some-people-exist-only-in-the-past-tense",
      "nostalgia-for-difficult-years",
    ],
    archiveEmotionFilter: "LONGING",
  },

  // =========================================================================
  // 3. OBJECTS & TRACES (Material Culture)
  // =========================================================================
  {
    id: "objects-01",
    slug: "what-an-old-receipt-can-remember",
    title: "What an Old Receipt Can Remember",
    subtitle: "A study of a 2018 coffee shop receipt found in a winter coat pocket: mundane timestamps as emotional anchors.",
    entryNumber: "NO. 0011",
    category: "objects-and-traces",
    seriesName: "Objects & Traces",
    date: "April 2025",
    readingTime: "4 min",
    depth: "brief",
    palette: "warm-parchment",
    excerpt:
      "Two coffees, one almond croissant, November 14, 2018, 14:22. The ink is fading into pale indigo dust, but the thermal paper still remembers the exact temperature of an afternoon before everything broke.",
    paragraphs: [
      "Sherry Turkle, the MIT sociologist who wrote *Evocative Objects*, observes that physical artifacts act as companions to our thoughts. Among all such artifacts, thermal receipts are the most fragile and the most unforgiving.",
      "Pulling an old winter coat from the back of a closet, your fingers find a stiff, folded slip of paper deep in the lining. You unfold it: *Café Madeleine, November 14, 2018, 14:22. 1 Drip Coffee, 1 Oat Flat White, 1 Almond Croissant. Total: $11.40.*",
      "The paper is already yellowing at the creases. The chemical coating is fading back into neutral cellulose. Yet the receipt functions as an accidental legal deposition: you were there, on a Wednesday afternoon, sitting across from someone whose voice you now have trouble reconstructing.",
      "Unlike a curated photograph, which is staged to flatter the present, a receipt is completely indifferent to vanity. It doesn't know that two months later you would have the argument that ended the lease. It only knows that at 2:22 PM on a rainy Wednesday, two drinks were carried to a wooden table.",
    ],
    tags: ["Objects", "Receipts", "Material Memory", "Ephemera"],
    relatedSlugs: [
      "the-afterlife-of-a-deleted-draft",
      "the-emotional-weight-of-an-abandoned-key",
      "field-note-words-written-in-library-margins",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "objects-02",
    slug: "the-afterlife-of-a-deleted-draft",
    title: "The Afterlife of a Deleted Draft",
    subtitle: "The psychology of the message typed, edited for fifteen minutes, and wiped clean by the backspace key.",
    entryNumber: "NO. 0012",
    category: "objects-and-traces",
    seriesName: "Objects & Traces",
    date: "March 2025",
    readingTime: "5 min",
    depth: "medium",
    palette: "charcoal",
    excerpt:
      "The blinking cursor on an empty text input is not empty at all. It is built upon the crushed debris of fourteen sentences that you lacked the recklessness to send.",
    paragraphs: [
      "Modern digital communication is unique in human history because it leaves zero trace of hesitation. When you wrote a letter on parchment in 1840, your crossings-out, blotches of ink, and crumpled preliminary sheets were physical facts. The recipient could see where your pen dragged.",
      "A smartphone text input, by contrast, presents an immaculate void. You can type four paragraphs of desperate confession, read it through three times, feel your pulse jump to ninety beats per minute, and then hold down the backspace key until the cursor swallows every syllable.",
      "Where do those deleted drafts go? Psychologically, they do not disappear. They migrate inward, hardening into permanent interior fixtures. The act of typing them out proved that the sentiment was fully formed in the cortex; the act of deleting them proved that you understood the social price of delivery.",
      "The archive of unsaid things is essentially a sanctuary for these deleted drafts. It takes the text that was held hostage between the thumb and the backspace key and gives it a resting place where it can exist without collateral damage.",
    ],
    pullQuote: {
      text: "The blinking cursor is not empty at all. It is built upon the crushed debris of fourteen sentences you lacked the recklessness to send.",
    },
    tags: ["Digital Memory", "Deleted Texts", "Hesitation", "Drafts"],
    relatedSlugs: [
      "the-message-you-rehearsed-while-walking-home",
      "what-an-old-receipt-can-remember",
      "the-midnight-unsend",
    ],
    archiveEmotionFilter: "LONGING",
  },
  {
    id: "objects-03",
    slug: "the-emotional-weight-of-an-abandoned-key",
    title: "The Emotional Weight of an Abandoned Key",
    subtitle: "Brass objects that no longer open any door in the owner's life, yet stubbornly resist being thrown into the trash.",
    entryNumber: "NO. 0013",
    category: "objects-and-traces",
    seriesName: "Objects & Traces",
    date: "February 2025",
    readingTime: "4 min",
    depth: "brief",
    palette: "deep-blue",
    excerpt:
      "In a small dish on the dresser rests a brass key with five ridges. The apartment was sold three years ago; the lock has probably been replaced twice. Throwing it in the garbage, however, feels like an act of sacrilege.",
    paragraphs: [
      "A key is a peculiar technological object: it is purely binary. Either it turns the tumbler and grants entrance to a private sanctuary, or it is a useless piece of milled brass. It has no aesthetic purpose; it cannot be repurposed as a paperweight or worn as jewelry without looking absurd.",
      "Yet almost every home contains a small ceramic dish or junk drawer holding at least one key whose lock no longer exists in the owner's world: an ex-lover’s front door, a childhood bicycle lock, a padlock to an abandoned storage shed.",
      "Why is throwing a key away so extraordinarily difficult? Because a key is an artifact of trust. To possess a key to someone's home is to have been granted unconditional entry into their private vulnerability. When the relationship ends, the lock is changed, but the key retains the symbolic imprint of that permission.",
      "Tossing it into a trash bin with coffee grounds and orange peels feels like an admission that the trust was worthless. So it sits in the dish for ten years, collecting dust—a small, cold monument to a door you once unlocked without knocking.",
    ],
    tags: ["Objects", "Keys", "Trust", "Sanctuary"],
    relatedSlugs: [
      "what-an-old-receipt-can-remember",
      "the-shoebox-under-the-wardrobe",
      "saved-coordinates-and-ghost-maps",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "objects-04",
    slug: "saved-coordinates-and-ghost-maps",
    title: "Saved Coordinates and Ghost Maps",
    subtitle: "Dropped pins in map apps for places that are no longer accessible: parking lots, street corners, demolished cafes.",
    entryNumber: "NO. 0014",
    category: "objects-and-traces",
    seriesName: "Objects & Traces",
    date: "January 2025",
    readingTime: "6 min",
    depth: "medium",
    palette: "forest",
    excerpt:
      "Open your mapping application and scroll to a city three hundred miles away. Amidst the highway interchanges and strip malls sits a small purple pin labeled 'Favorite place.' The cafe closed in 2021, but the satellite still holds the coordinates.",
    paragraphs: [
      "We inhabit two geographies simultaneously: the objective physical grid maintained by municipal surveyors, and a private emotional topography superimposed over it like a transparent overlay.",
      "In the physical grid, 41.8781° N, 87.6298° W is a generic stretch of pavement outside a municipal library. In someone’s private topography, it is the exact square meter where they sat on a granite bench at 1:00 AM and realized their marriage was over.",
      "Modern digital mapping tools have made these emotional topographies shockingly durable. People save dropped pins for gravel pull-offs in state parks where they confessed something in a parked car, or the corner grocery store where they bought cherries with someone who died five years ago.",
      "These pins are ghost markers. The buildings may be renovated into vape shops; the trees may be cut down for highway widening; yet on the glowing screen, the blue dot hovers over the spot, testifying that an internal universe once collapsed there in silence.",
    ],
    pullQuote: {
      text: "We inhabit two geographies: the municipal grid of surveyors, and the private emotional topography superimposed over it.",
    },
    tags: ["Maps", "Geography", "Digital Traces", "Place Memory"],
    relatedSlugs: [
      "what-an-old-receipt-can-remember",
      "the-emotional-weight-of-an-abandoned-key",
      "field-note-platform-4-at-1142-pm",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "objects-05",
    slug: "the-voice-note-kept-for-five-hundred-days",
    title: "The Voice Note Kept for Five Hundred Days",
    subtitle: "Listening to twenty-eight seconds of someone’s voice who has not spoken to you in two years: the acoustics of absence.",
    entryNumber: "NO. 0015",
    category: "objects-and-traces",
    seriesName: "Objects & Traces",
    date: "December 2024",
    readingTime: "5 min",
    depth: "medium",
    palette: "dusty-plum",
    excerpt:
      "A photograph preserves light; a voice note preserves the lungs. Hearing the intake of breath before an ordinary sentence can dismantle two years of emotional composure in three seconds.",
    paragraphs: [
      "Photographs are silent. They allow the viewer to maintain a comfortable distance, imposing whatever narrative they wish upon the frozen smile. Sound, however, is invasive. It enters the ear canal directly, vibrating the tympanic membrane with the exact acoustic pressure generated by another person’s vocal cords.",
      "When someone dies or disappears into an estrangement, their saved voice notes take on the qualities of an auditory relic. 'Hey, I’m downstairs, the buzzer isn’t working, let me know when you come down.' The content is trivial, almost aggressively mundane.",
      "Yet it is precisely that mundanity that wounds. The message does not contain a solemn goodbye; it contains the casual, unhurried cadence of someone who assumed they would see you in three minutes. You hear the traffic in the background, the wind catching the microphone, the small, involuntary breath before the word 'Hey.'",
      "People keep these files saved in starred folders on their phones like vials of nitroglycerin. They open them once every six months, usually after midnight, listening in total darkness to confirm that the person was real, and then quickly closing the app before the grief becomes unmanageable.",
    ],
    tags: ["Voice", "Sound", "Absence", "Digital Relics"],
    relatedSlugs: [
      "the-afterlife-of-a-deleted-draft",
      "some-people-exist-only-in-the-past-tense",
      "what-an-old-receipt-can-remember",
    ],
    archiveEmotionFilter: "LONGING",
  },

  // =========================================================================
  // 4. RESEARCH NOTES (Empirical Studies)
  // =========================================================================
  {
    id: "research-01",
    slug: "research-note-the-neural-gap-between-present-and-future-selves",
    title: "Research Note: The Neural Gap Between Present and Future Selves",
    subtitle: "A review of Ersner-Hershfield et al. (2009) on rACC activation and why writing to our future self alters temporal discounting.",
    entryNumber: "NO. 0016",
    category: "research-notes",
    seriesName: "Research Notes",
    date: "November 2024",
    readingTime: "6 min",
    depth: "medium",
    palette: "sage",
    excerpt:
      "When functional MRI scans monitor brain activity during self-reflection, thinking about yourself in ten years produces nearly identical activation patterns to thinking about a complete stranger.",
    paragraphs: [
      "Why is it so effortless to promise that 'future me will deal with this,' while simultaneously making decisions that sabotage that very person? A landmark neuroimaging experiment led by Hal Ersner-Hershfield, Brian Knutson, and colleagues at Stanford and UCLA provides a biological answer.",
      "In the 2009 study, participants were placed in an fMRI scanner and asked to make trait judgments about their current self, their self ten years in the future, and a neutral stranger (Matt Damon). When people thought about their current self, the rostral anterior cingulate cortex (rACC)—a critical hub for self-referential emotion and identity—lit up vividly.",
      "However, when asked to consider their *future* self, the rACC quieted down dramatically, mimicking the neural profile observed when considering a stranger. The degree of this 'neural discount' directly predicted behavior: individuals with the largest neural gap between current and future selves demonstrated significantly higher temporal discounting (choosing smaller immediate rewards over larger delayed ones).",
      "Subsequent behavioral interventions tested whether narrative connection could bridge this neurological gulf. Writing letters to one's future self, or interacting with age-progressed digital renderings, systematically increased future-self continuity and reduced impulsive deferral.",
      "From an archival perspective, this reveals why letters to a future self are so emotionally stabilizing. They are not merely whimsical exercises; they are cognitive bridges that force the brain to grant legal personhood to the stranger who will inherit our bodies ten years from now.",
    ],
    pullQuote: {
      text: "Thinking about yourself in ten years produces nearly identical activation patterns in the rACC to thinking about a complete stranger.",
    },
    researchContext: {
      finding:
        "The rostral anterior cingulate cortex (rACC) treats future selves with the same neural indifference as unfamiliar strangers. Narrative exercises like letter-writing bridge this continuity gap.",
      sources: [
        {
          title: "Saving for the future self: Neural measures of future self-continuity predict temporal discounting",
          authors: "Ersner-Hershfield, H., Wimmer, G. E., & Knutson, B.",
          year: 2009,
          publication: "Social Cognitive and Affective Neuroscience, 4(1), 85–92",
          doiOrUrl: "https://doi.org/10.1093/scan/nsn042",
        },
        {
          title: "Future self-continuity: how conceptions of the future self transform intertemporal choice",
          authors: "Hershfield, H. E.",
          year: 2011,
          publication: "Annals of the New York Academy of Sciences, 1235(1), 30–43",
          doiOrUrl: "https://doi.org/10.1111/j.1749-6632.2011.06201.x",
        },
      ],
    },
    tags: ["Cognitive Neuroscience", "fMRI", "Future Self", "Temporal Discounting"],
    relatedSlugs: [
      "letters-written-across-ten-years",
      "research-note-the-mechanics-of-self-distancing",
      "the-version-of-you-that-lives-in-someone-elses-memory",
    ],
  },
  {
    id: "research-02",
    slug: "research-note-when-expressive-writing-fails",
    title: "Research Note: When Expressive Writing Fails",
    subtitle: "Examining the limits of Pennebaker's paradigm: why venting without cognitive restructuring exacerbates emotional distress.",
    entryNumber: "NO. 0017",
    category: "research-notes",
    seriesName: "Research Notes",
    date: "October 2024",
    readingTime: "7 min",
    depth: "medium",
    palette: "faded-brick",
    excerpt:
      "For four decades, popular culture has treated journaling as an unalloyed panacea. Yet empirical trials show that unstructured emotional venting often acts as fuel on the fire of rumination.",
    paragraphs: [
      "In 1986, James Pennebaker published a classic protocol: participants wrote about their deepest traumas for fifteen minutes a day over four consecutive days. The results showed improved immune markers, fewer physician visits, and measurable psychological relief.",
      "However, decades of subsequent replication and meta-analytic work (such as Frattaroli, 2006; Stroebe et al., 2002) revealed crucial boundaries. Expressive writing is not an unconditional cure; in certain populations—particularly those undergoing acute bereavement or severe marital divorce (Sbarra et al., 2011)—writing repeatedly about emotional pain actually *slowed* recovery and heightened cardiovascular distress.",
      "The decisive variable identified by computational linguistic analysis (Pennebaker, Mayne, & Francis, 1997) was cognitive restructuring. Participants who benefited did not simply regurgitate grief; their writing showed a marked increase over time in causal and insight words ('because', 'reason', 'understand', 'realize').",
      "Those who merely chronicled their misery without constructing a narrative arc remained trapped in depressive rumination. The brain does not need to relive a fire; it needs an architect to draw a diagram of how the fire started and where the fire doors were located.",
    ],
    researchContext: {
      finding:
        "Expressive writing improves health outcomes only when it drives causal insight and narrative organization. Pure emotional venting without reappraisal increases rumination.",
      sources: [
        {
          title: "Confronting a traumatic event: toward an understanding of inhibition and disease",
          authors: "Pennebaker, J. W., & Beall, S. K.",
          year: 1986,
          publication: "Journal of Abnormal Psychology, 95(3), 274–281",
        },
        {
          title: "When writing about a relationship breakup is good and bad: Expressive writing and emotional recovery",
          authors: "Sbarra, D. A., Boals, A., Mason, A. E., Larson, G. M., & Mehl, M. R.",
          year: 2011,
          publication: "Clinical Psychological Science, 1(1), 80–91",
        },
      ],
    },
    tags: ["Expressive Writing", "Pennebaker", "Rumination", "Cognitive Reappraisal"],
    relatedSlugs: [
      "research-note-the-mechanics-of-self-distancing",
      "on-forgiving-people-who-will-never-know",
      "the-afterlife-of-a-deleted-draft",
    ],
  },
  {
    id: "research-03",
    slug: "research-note-the-mechanics-of-self-distancing",
    title: "Research Note: The Mechanics of Self-Distancing",
    subtitle: "Kross & Ayduk's experiments on how third-person self-talk reduces cardiovascular stress and quells rumination chatter.",
    entryNumber: "NO. 0018",
    category: "research-notes",
    seriesName: "Research Notes",
    date: "September 2024",
    readingTime: "6 min",
    depth: "medium",
    palette: "deep-blue",
    excerpt:
      "Shifting from first-person ('Why am I feeling this?') to third-person ('Why is David feeling this?') sounds like an awkward linguistic trick. In brain scans, it instantly lowers amygdala reactivity.",
    paragraphs: [
      "When we experience acute emotional failure, our default introspective stance is self-immersion: we look out through our own eyes and replay the humiliating or agonizing sequence in vivid first-person HD. Research by Ethan Kross (University of Michigan) and Özlem Ayduk (UC Berkeley) demonstrates that this immersion activates the brain's default mode network in ways that promote cyclic rumination.",
      "In a sequence of foundational studies (Ayduk & Kross, 2010; Kross et al., 2014), the researchers tested 'self-distancing'—instructing participants to reflect on a painful memory from the perspective of an objective, fly-on-the-wall observer, or using non-first-person pronouns and their own name.",
      "The results were startlingly consistent across behavioral, cardiovascular, and neural measures. Third-person self-talk ('Why did Sarah feel so betrayed during that conversation?') reduced heart rate spikes, minimized emotional distress, and facilitated adaptive reappraisal rather than anxious replay.",
      "The underlying mechanism engages what psychological literature calls 'Solomon’s Paradox' (Grossmann & Kross, 2014): humans demonstrate far superior cognitive wisdom and emotional temperance when analyzing other people's conflicts than their own. Self-distancing tricks the brain's social cognition machinery into treating your own wounded heart as that of a friend who needs sensible counsel.",
    ],
    pullQuote: {
      text: "Self-distancing tricks the brain into treating your own wounded heart as that of a friend who needs sensible counsel.",
    },
    researchContext: {
      finding:
        "Adopting a self-distanced, third-person perspective reduces cardiovascular reactivity and rumination by recruiting social-reasoning networks normally reserved for advising others.",
      sources: [
        {
          title: "From a distance: Implications of spontaneous self-distancing for adaptive emotional processing",
          authors: "Ayduk, Ö., & Kross, E.",
          year: 2010,
          publication: "Journal of Personality and Social Psychology, 98(5), 809–829",
          doiOrUrl: "https://doi.org/10.1037/a0019205",
        },
        {
          title: "Self-talk as a regulatory mechanism: How you do it matters",
          authors: "Kross, E., Bruehlman-Senecal, E., et al.",
          year: 2014,
          publication: "Journal of Personality and Social Psychology, 106(2), 304–324",
          doiOrUrl: "https://doi.org/10.1037/a0035173",
        },
      ],
    },
    tags: ["Self-Distancing", "Ethan Kross", "Third-Person", "Solomon Paradox"],
    relatedSlugs: [
      "research-note-when-expressive-writing-fails",
      "research-note-the-neural-gap-between-present-and-future-selves",
      "the-message-you-rehearsed-while-walking-home",
    ],
  },
  {
    id: "research-04",
    slug: "research-note-nostalgia-as-a-homeostatic-corrective",
    title: "Research Note: Nostalgia as a Homeostatic Corrective",
    subtitle: "Sedikides & Wildschut (Southampton) on nostalgia as an evolutionary buffer against meaninglessness and existential loneliness.",
    entryNumber: "NO. 0019",
    category: "research-notes",
    seriesName: "Research Notes",
    date: "August 2024",
    readingTime: "6 min",
    depth: "medium",
    palette: "ochre",
    excerpt:
      "For three hundred years, medical manuals classified nostalgia as a fatal brain lesion. Modern experimental psychology demonstrates that it is actually a psychological thermostat.",
    paragraphs: [
      "When Swiss physician Johannes Hofer coined the term *nostalgia* in 1688, he regarded it as a neurological affliction caused by 'the continuous vibration of animal spirits' in Swiss mercenaries longing for their Alpine valleys. For centuries, longing for the past was pathologized as a form of melancholic sickness.",
      "Over the past two decades, experimental psychologists Constantine Sedikides and Tim Wildschut at the University of Southampton have systematically dismantled that view. In dozens of empirical trials across multiple cultures, they demonstrated that nostalgia is an inherently adaptive, affectively mixed emotion.",
      "Most importantly, their research demonstrates that nostalgia acts as an internal 'homeostatic corrective.' When individuals are experimentally subjected to existential threats—boredom, loneliness, mortality salience, or feelings of meaninglessness—the mind spontaneously recruits nostalgic memories to re-establish emotional equilibrium.",
      "Nostalgic recollections are not random; they almost always feature close social connections, redemption arcs, and milestones of personal agency. By replaying these curated memories, the brain bolsters feelings of social support, reinforces identity continuity, and buffers against existential despair.",
    ],
    researchContext: {
      finding:
        "Nostalgia serves as a psychological homeostatic mechanism. When threatened by loneliness or meaninglessness, individuals naturally recruit nostalgic memories to restore existential stability.",
      sources: [
        {
          title: "Nostalgia: Content, triggers, functions",
          authors: "Wildschut, T., Sedikides, C., Arndt, J., & Routledge, C.",
          year: 2006,
          publication: "Journal of Personality and Social Psychology, 91(5), 975–993",
          doiOrUrl: "https://doi.org/10.1037/0022-3514.91.5.975",
        },
        {
          title: "To nostalgize: Expanding a bittersweet emotion",
          authors: "Sedikides, C., & Wildschut, T.",
          year: 2016,
          publication: "Current Opinion in Psychology, 10, 120–124",
        },
      ],
    },
    tags: ["Nostalgia", "Existential Meaning", "Sedikides", "Wildschut"],
    relatedSlugs: [
      "nostalgia-for-difficult-years",
      "the-version-of-you-that-lives-in-someone-elses-memory",
      "what-an-old-receipt-can-remember",
    ],
  },
  {
    id: "research-05",
    slug: "research-note-the-dissociative-anonymity-of-the-confession-screen",
    title: "Research Note: The Dissociative Anonymity of the Confession Screen",
    subtitle: "John Suler's online disinhibition framework applied to anonymous text depositories.",
    entryNumber: "NO. 0020",
    category: "research-notes",
    seriesName: "Research Notes",
    date: "July 2024",
    readingTime: "7 min",
    depth: "medium",
    palette: "charcoal",
    excerpt:
      "Why do people reveal things to a black screen and anonymous strangers that they would take to the grave before telling their spouse? The psychology of benign online disinhibition.",
    paragraphs: [
      "In 2004, cyberpsychologist John Suler published a foundational paper outlining the 'Online Disinhibition Effect.' While public discourse often focuses on toxic disinhibition (cyberbullying, trolling), Suler identified a parallel phenomenon: 'benign disinhibition,' where digital spaces encourage profound emotional honesty and vulnerability.",
      "Suler isolated six interlocking psychological factors that create this state: dissociative anonymity ('You don’t know me'), invisibility ('You can’t see me'), asynchronicity ('I don’t have to deal with your immediate reaction'), solipsistic introjection ('It’s all in my head'), dissociative imagination ('It’s just a digital room'), and minimization of status.",
      "In physical interactions, human disclosure is governed by constant micro-feedback: the other person's wince, their crossed arms, the tilt of their head. This feedback creates protective social friction, preventing us from saying things that might destabilize the relationship.",
      "An anonymous archive strips away both the fear of reprisal and the burden of maintenance. You can place the truth on digital stone, witness other human beings reading it in quiet solidarity, and never have to explain yourself over breakfast tomorrow.",
    ],
    researchContext: {
      finding:
        "Dissociative anonymity and asynchronous interaction reduce social threat and evaluation anxiety, enabling benign disinhibition where individuals disclose deeply buried emotional truths.",
      sources: [
        {
          title: "The online disinhibition effect",
          authors: "Suler, J.",
          year: 2004,
          publication: "CyberPsychology & Behavior, 7(3), 321–326",
          doiOrUrl: "https://doi.org/10.1089/1094931041291295",
        },
      ],
    },
    tags: ["Cyberpsychology", "Anonymity", "Disinhibition", "Vulnerability"],
    relatedSlugs: [
      "the-afterlife-of-a-deleted-draft",
      "on-forgiving-people-who-will-never-know",
      "the-midnight-unsend",
    ],
  },
  {
    id: "research-06",
    slug: "research-note-autobiographical-reasoning-and-narrative-contamination",
    title: "Research Note: Autobiographical Reasoning and Narrative Contamination",
    subtitle: "Dan McAdams on how redemption vs. contamination story arcs predict long-term psychological resilience.",
    entryNumber: "NO. 0021",
    category: "research-notes",
    seriesName: "Research Notes",
    date: "June 2024",
    readingTime: "8 min",
    depth: "medium",
    palette: "dusty-plum",
    excerpt:
      "When people recount their life turning points, the grammatical arc of their story determines whether past trauma heals into wisdom or festers into chronic bitterness.",
    paragraphs: [
      "Dan McAdams, a pioneer in narrative psychology at Northwestern University, posits that human personality cannot be fully measured by traits like extroversion or conscientiousness alone. The third, most vital layer is 'narrative identity'—the internalized, evolving life story an individual constructs to provide their existence with unity and purpose.",
      "Through decades of life-story interviews, McAdams discovered that how people link turning points (episodes of high emotional salience) follows two primary affective patterns: redemption sequences and contamination sequences.",
      "In a redemption sequence, a distinctly negative state (failure, grief, heartbreak) leads causally to an emotionally positive outcome (insight, resilience, empathy). In contrast, a contamination sequence describes a positive or hopeful state that is abruptly spoiled, ruined, or contaminated by an ensuing catastrophe.",
      "Longitudinal findings demonstrate that individuals who habitually organize their personal history through contamination sequences suffer significantly higher rates of depression, chronic rumination, and identity fragmentation. Learning to re-author those contaminated scenes—often through private writing that extracts meaning rather than replaying victimhood—is a critical engine of psychological resilience.",
    ],
    researchContext: {
      finding:
        "Autobiographical narrative structures directly predict mental health: redemption arcs foster resilience and generativity, while contamination sequences sustain depressive rumination.",
      sources: [
        {
          title: "The psychology of life stories",
          authors: "McAdams, D. P.",
          year: 2001,
          publication: "Review of General Psychology, 5(2), 100–122",
          doiOrUrl: "https://doi.org/10.1037/1089-2680.5.2.100",
        },
        {
          title: "Narrative identity: What is it, and how does it develop?",
          authors: "McAdams, D. P., & McLean, K. C.",
          year: 2013,
          publication: "Current Directions in Psychological Science, 22(3), 233–238",
        },
      ],
    },
    tags: ["Narrative Identity", "Dan McAdams", "Resilience", "Redemption"],
    relatedSlugs: [
      "memory-distortions-and-the-stories-we-protect",
      "on-forgiving-people-who-will-never-know",
      "research-note-when-expressive-writing-fails",
    ],
  },

  // =========================================================================
  // 5. FIELD NOTES (Observations & Fragments)
  // =========================================================================
  {
    id: "field-01",
    slug: "field-note-platform-4-at-1142-pm",
    title: "Field Note: Platform 4 at 11:42 PM",
    subtitle: "A brief study in body language between two people waiting for an intercity train with ten minutes left to speak.",
    entryNumber: "NO. 0022",
    category: "field-notes",
    seriesName: "Field Notes",
    date: "May 2024",
    readingTime: "3 min",
    depth: "brief",
    palette: "charcoal",
    excerpt:
      "Two people standing under yellow floodlights, six inches of empty platform asphalt between their winter sleeves. Everything that needed to be said was already thirty minutes too late.",
    paragraphs: [
      "Platform 4, Penn Station or Zurich Hauptbahnhof or New Delhi—the geography doesn't matter; the acoustics are identical everywhere in the world. Cold concrete, the diesel smell of idling locomotives, and the mechanical clock clicking down toward departure.",
      "They stand next to a wheeled suitcase. He has his hands wedged into his overcoat pockets; she is holding a half-empty paper cup of coffee that went lukewarm twenty minutes ago. Neither of them is drinking. Neither of them is walking toward the carriage door.",
      "Every three minutes, one of them glances up at the digital overhead board. The train is on time. The train is always ruthlessly on time when two people need an unforeseen forty-minute delay to say the one sentence that could change the direction of their lives.",
      "When the conductor blows the whistle, they do not have a movie kiss. They have an awkward, three-second squeeze of elbows through down feathers. 'Text me when you get in,' he says. 'I will,' she says. Both of them know she won't.",
    ],
    tags: ["Platform", "Goodbyes", "Trains", "Hesitation"],
    relatedSlugs: [
      "the-message-you-rehearsed-while-walking-home",
      "field-note-the-unsent-birthday-text",
      "the-conversation-we-scheduled-for-sometime-in-the-spring",
    ],
    archiveEmotionFilter: "LONGING",
  },
  {
    id: "field-02",
    slug: "field-note-words-written-in-library-margins",
    title: "Field Note: Words Written in Library Margins",
    subtitle: "Pencil inscriptions in borrowed library books: anonymous dialogues between strangers separated by decades.",
    entryNumber: "NO. 0023",
    category: "field-notes",
    seriesName: "Field Notes",
    date: "April 2024",
    readingTime: "3 min",
    depth: "brief",
    palette: "warm-parchment",
    excerpt:
      "A faint pencil underline beneath a sentence by Walter Benjamin, and in the margin, a tiny notation: 'Not true for us, 1994.' An anonymous confession preserved in the library stacks.",
    paragraphs: [
      "In the fifth-floor stacks of an old university library, books become palimpsests of human interiority. Librarians spend their careers erasing pencil marks, but the persistent ones endure like archaeological graffiti.",
      "On page 142 of a faded volume of Roland Barthes' *A Lover's Discourse*, someone thirty years ago took an HB pencil and underlined: *'Am I in love? —yes, since I am waiting.'* Below it, squeezed against the binding, is a single initials inscription: *'M.S. — you never showed up.'*",
      "Who was M.S.? Did they get stuck in traffic? Did they simply lose interest? The book gives no resolution. It was returned to the drop box, stamped, reshelved, and sat in darkness for eight thousand days until another lonely person pulled it down on a rainy Tuesday.",
      "Marginalia is the oldest form of the unsaid. It is a letter addressed to the next person whose heart is broken in precisely the same cadence.",
    ],
    tags: ["Books", "Marginalia", "Libraries", "Anonymous Dialogue"],
    relatedSlugs: [
      "what-an-old-receipt-can-remember",
      "field-note-platform-4-at-1142-pm",
      "to-the-stranger-on-the-cross-town-bus",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "field-03",
    slug: "field-note-the-unsent-birthday-text",
    title: "Field Note: The Unsent Birthday Text",
    subtitle: "The 11:58 PM hesitation on an annual calendar notification that you forgot to delete.",
    entryNumber: "NO. 0024",
    category: "field-notes",
    seriesName: "Field Notes",
    date: "March 2024",
    readingTime: "3 min",
    depth: "brief",
    palette: "dusty-rose",
    excerpt:
      "A pop-up banner on your home screen: 'David's Birthday.' You haven't spoken since the argument outside the restaurant in 2022. You stare at the screen as the clock counts down to midnight.",
    paragraphs: [
      "Annual calendar notifications are the landmines of modern friendship. When you add someone’s birthday to your phone, you do so in the flush of early affection, never anticipating that eight years later, the software will loyally serve up the reminder to a person who is now a ghost.",
      "At 11:58 PM, you unlock the screen. You open the messaging thread. The last text sent was twenty-two months ago: 'No worries, let's talk next week.' You type: 'Happy birthday, hope you're doing well.'",
      "It sits there in the bubble. What does it mean if you send it? It means you remember. What does it mean if they don't reply? It means you are still the one holding the rope. What does it mean if they reply with a polite heart emoji? That is perhaps the most devastating outcome of all: an etiquette response to a severed bond.",
      "At 12:01 AM, the calendar flips. The notification dismisses itself. You select the text, tap delete, and put the phone face down on the nightstand.",
    ],
    tags: ["Birthdays", "Calendar", "Digital Hesitation", "Estrangement"],
    relatedSlugs: [
      "the-afterlife-of-a-deleted-draft",
      "some-people-exist-only-in-the-past-tense",
      "field-note-platform-4-at-1142-pm",
    ],
    archiveEmotionFilter: "LONGING",
  },
  {
    id: "field-04",
    slug: "field-note-the-sound-of-dishwashing-in-an-argument",
    title: "Field Note: The Sound of Dishwashing in an Argument",
    subtitle: "Domestic acoustic camouflage: how the rhythm of kitchen chores absorbs words that cannot be safely articulated.",
    entryNumber: "NO. 0025",
    category: "field-notes",
    seriesName: "Field Notes",
    date: "February 2024",
    readingTime: "3 min",
    depth: "brief",
    palette: "terracotta",
    excerpt:
      "The ceramic plate is scraped with far more force than necessary. The running water is turned on full blast. Chores are the ultimate domestic disguise for fury that has run out of vocabulary.",
    paragraphs: [
      "In long-term domestic partnerships, chores rarely remain neutral physical maintenance. When a conflict reaches an impasse—when both parties know that the next spoken sentence will trigger an uncontainable escalation—the kitchen sink becomes an acoustic bunker.",
      "One person stands at the sink with their back turned. The faucet is opened to maximum pressure, drowning out the ambient room tone. A sponge is dragged across a skillet with methodical, violent precision. The clatter of forks into a drying rack carries the exact percussive syntax of an expletive.",
      "The person sitting at the kitchen table reads the message perfectly. The water running is not about hygiene; it is about establishing a sonic barricade. Behind that wall of rushing water, twenty furious, wounded sentences are being rehearsed and swallowed.",
      "When the water is finally turned off, the ensuing silence is twice as loud as before. 'Do we have any more paper towels?' one of them asks. 'In the pantry,' the other replies. The conversation is over. The dishes are clean.",
    ],
    tags: ["Domesticity", "Silence", "Chores", "Anger"],
    relatedSlugs: [
      "why-silence-is-loudest-in-small-rooms",
      "the-words-we-swap-for-weather",
      "the-message-you-rehearsed-while-walking-home",
    ],
    archiveEmotionFilter: "ANGER",
  },
  {
    id: "field-05",
    slug: "field-note-old-usernames-as-ghost-identities",
    title: "Field Note: Old Usernames as Ghost Identities",
    subtitle: "Stumbling upon an online handle registered in 2012 that still speaks with the dead cadence of who you used to be.",
    entryNumber: "NO. 0026",
    category: "field-notes",
    seriesName: "Field Notes",
    date: "January 2024",
    readingTime: "3 min",
    depth: "brief",
    palette: "deep-blue",
    excerpt:
      "A forgotten forum account or gaming handle from when you were nineteen: looking through your own post history is like reading letters written by an excitable nephew who died a decade ago.",
    paragraphs: [
      "We change physical homes, throw out high school yearbooks, and donate old clothes. But the internet is an unforgiving taxidermist. Every half-abandoned username you created between ages sixteen and twenty-two is still out there, pinned to a forum database like a dried beetle.",
      "You find yourself on an old discussion board while troubleshooting an obscure technical problem. There is your avatar—a blurry screenshot from an anime you haven't watched in fifteen years. There is your bio: 'Cynical idealist. Coffee and insomnia.'",
      "Reading through the comment history produces an acute, agonizing cringe. You were so desperate to sound sophisticated. You picked fights with strangers over bands you don't even listen to anymore. You quoted philosophers you hadn't actually read.",
      "Yet beneath the cringe lies an unexpected tenderness. That nineteen-year-old was trying so hard to construct an armor against the terror of not knowing who they were. You close the browser tab gently, leaving the ghost to guard the empty server.",
    ],
    tags: ["Internet History", "Usernames", "Past Selves", "Identity"],
    relatedSlugs: [
      "the-version-of-you-that-lives-in-someone-elses-memory",
      "some-people-exist-only-in-the-past-tense",
      "the-afterlife-of-a-deleted-draft",
    ],
    archiveEmotionFilter: "MEMORY",
  },

  // =========================================================================
  // 6. LETTERS NEVER SENT
  // =========================================================================
  {
    id: "letters-01",
    slug: "a-letter-to-the-person-i-replaced",
    title: "A Letter to the Person I Replaced",
    subtitle: "An unsent letter to the predecessor in a job, an apartment, or a relationship.",
    entryNumber: "NO. 0027",
    category: "letters-never-sent",
    seriesName: "Letters Never Sent",
    date: "December 2023",
    readingTime: "5 min",
    depth: "medium",
    palette: "forest",
    excerpt:
      "You left a nail in the hallway wall and a grease pencil mark inside the pantry cabinet. I sleep in the room where you once dreamed about leaving, and I understand why you left.",
    paragraphs: [
      "Dear Predecessor,",
      "I found your receipt for radiator valve repair under the kitchen drawer two months after I moved in. You lived here for four years. The super still occasionally refers to this unit as 'the apartment with the pianist.'",
      "I know which window sticks when the humidity rises in July. I know that if you step on the floorboard outside the bathroom, the radiator in the living room groans like an old dog. You adapted your walking habits to avoid that floorboard, and within two weeks, without ever meeting you, I adopted the exact same gait.",
      "We have an odd, one-way intimacy, you and I. I inherit the worn corners of your habits. When someone replaces another person—in an apartment, at a desk in an office, or in the bed of someone who still has trouble talking about you—they are constantly bumping into the negative space you left behind.",
      "I hope wherever you went, the windows open smoothly. I left your nail in the wall. It seemed arrogant to take it down.",
    ],
    pullQuote: {
      text: "When someone replaces another person, they are constantly bumping into the negative space left behind.",
    },
    tags: ["Predecessors", "Inheritance", "Apartments", "Negative Space"],
    relatedSlugs: [
      "what-an-old-receipt-can-remember",
      "the-emotional-weight-of-an-abandoned-key",
      "to-the-stranger-on-the-cross-town-bus",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "letters-02",
    slug: "letters-written-across-ten-years",
    title: "Letters Written Across Ten Years",
    subtitle: "How an annual unsent birthday letter to oneself documents changes in handwriting, panic, and worldview.",
    entryNumber: "NO. 0028",
    category: "letters-never-sent",
    seriesName: "Letters Never Sent",
    date: "November 2023",
    readingTime: "6 min",
    depth: "medium",
    palette: "warm-parchment",
    excerpt:
      "At twenty-two, the letter was frantic and full of exclamation points about ambition. At thirty-two, the letter is four calm sentences written in black ink, mostly checking whether we slept eight hours last night.",
    paragraphs: [
      "Many people maintain a private ritual of writing an unsent letter on their birthday, sealing it in an envelope, and stashing it away to be opened five or ten years later. It is a correspondence across time where the author and the recipient are technically the same legal person, but psychologically alien to one another.",
      "When you line up these letters in chronological order, the first thing you notice is the physical change in handwriting. At twenty-two, the strokes are aggressive, hurried, slanting forward with the frantic momentum of someone convinced they are running out of time to become a prodigy.",
      "By twenty-seven, the script has flattened. The questions are different: less about prestige and awards, more about survival: 'Did we figure out how to pay off the medical bill? Are we still friends with Marcus?' There is fear in the margins.",
      "By thirty-two, the tone shifts into something approaching peace. The letter is shorter. The handwriting is upright and measured. The author no longer demands that the future self be famous or extraordinary; they simply ask: 'Are you being gentle with yourself? Did you plant the tomatoes this spring?'",
      "Writing across time teaches us that maturity is not the accumulation of answers. It is the gradual abandonment of questions that were designed to impress other people.",
    ],
    tags: ["Time Travel", "Birthday Letters", "Handwriting", "Maturity"],
    relatedSlugs: [
      "research-note-the-neural-gap-between-present-and-future-selves",
      "the-shoebox-under-the-wardrobe",
      "the-version-of-you-that-lives-in-someone-elses-memory",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "letters-03",
    slug: "to-the-stranger-on-the-cross-town-bus",
    title: "To the Stranger on the Cross-Town Bus",
    subtitle: "The transient intimacy of eye contact during an ambulance siren with someone you will never see again.",
    entryNumber: "NO. 0029",
    category: "letters-never-sent",
    seriesName: "Letters Never Sent",
    date: "October 2023",
    readingTime: "4 min",
    depth: "brief",
    palette: "ochre",
    excerpt:
      "We sat across from each other on the 79th Street bus while an ambulance screamed past outside. For four seconds our eyes locked in shared recognition of human fragility, and then we both looked back down at our phones.",
    paragraphs: [
      "To the man in the charcoal coat on the M79 Tuesday evening:",
      "We didn't speak, because cities have strict unwritten laws against speaking to strangers without an emergency. But when that ambulance siren wound up to top volume right outside our window, vibrating the glass against our shoulders, everyone on the bus flinched.",
      "You looked up from your book, and I looked up from my lap. For four full seconds, we looked directly into each other's pupils with total, undisguised vulnerability. In that glance was a complete sentence: *Someone in this city is having the worst night of their life, and both of us are miraculously whole on a warm bus.*",
      "Then the siren faded down Broadway. The spell broke. You cleared your throat; I checked a notification that didn't exist; we both returned to our designated citizen postures. You got off at Amsterdam Avenue.",
      "I don't know your name or where you were going. But for four seconds, you were closer to my real interior state than anyone I talked to at work all day. I hope whatever was waiting for you at your stop was kind.",
    ],
    tags: ["Strangers", "Public Transit", "Transience", "Eye Contact"],
    relatedSlugs: [
      "field-note-platform-4-at-1142-pm",
      "a-letter-to-the-person-i-replaced",
      "the-words-we-swap-for-weather",
    ],
    archiveEmotionFilter: "GRATITUDE",
  },
  {
    id: "letters-04",
    slug: "the-conversation-we-scheduled-for-sometime-in-the-spring",
    title: "The Conversation We Scheduled for Sometime in the Spring",
    subtitle: "On vague temporal promises ('let's catch up when the weather gets warmer') that serve as gentle, cowardly farewells.",
    entryNumber: "NO. 0030",
    category: "letters-never-sent",
    seriesName: "Letters Never Sent",
    date: "September 2023",
    readingTime: "5 min",
    depth: "medium",
    palette: "dusty-plum",
    excerpt:
      "'Let's definitely get coffee once things slow down in May.' May came and went. The leaves fell in October. Neither of us reached out, because we both understood the code.",
    paragraphs: [
      "Dear Friend,",
      "When we said goodbye outside the subway station in November, you said: 'Let's definitely catch up properly in the spring, once work calms down.' I smiled and agreed. We hugged with that specific one-handed pat on the back that signals friendship transitioning from active duty into the reserves.",
      "Spring came. The cherry blossoms bloomed and were washed into gutters by cold rain. May turned into the swelter of August. Neither of us sent a text. We didn't forget; our calendars weren't that overwhelmed. We simply respected the diplomatic fiction.",
      "'In the spring' is the polite adult euphemism for 'never again, but without the unpleasantness of a confrontation.' It allows both people to part on good terms, preserving the comforting illusion that the friendship is merely dormant rather than dead.",
      "I am writing this not to resurrect the coffee date. I am writing to thank you for the six years when we didn't need to schedule things three seasons in advance. That was real. The spring was just the polite shroud we put over it.",
    ],
    pullQuote: {
      text: "'In the spring' is the polite adult euphemism for 'never again, but without the unpleasantness of a confrontation.'",
    },
    tags: ["Friendship", "Farewells", "Euphemisms", "Drift"],
    relatedSlugs: [
      "some-people-exist-only-in-the-past-tense",
      "field-note-the-unsent-birthday-text",
      "the-geography-of-the-almost",
    ],
    archiveEmotionFilter: "LONGING",
  },

  // =========================================================================
  // 7. SMALL RITUALS
  // =========================================================================
  {
    id: "rituals-01",
    slug: "the-shoebox-under-the-wardrobe",
    title: "The Shoebox Under the Wardrobe",
    subtitle: "Why people curate physical graveyards of letters and movie tickets they never intend to open.",
    entryNumber: "NO. 0031",
    category: "small-rituals",
    seriesName: "Small Rituals",
    date: "August 2023",
    readingTime: "4 min",
    depth: "brief",
    palette: "warm-parchment",
    excerpt:
      "Taped shut with brown packing tape or tucked under extra blankets: the shoebox of past relationships is an emotional nuclear waste site that we refuse to decommission.",
    paragraphs: [
      "Almost every adult who has loved and lost more than once keeps a box. It is usually an old Nike or boot box, shoved into the dead corner of a closet or beneath winter coats where dust bunnies accumulate undisturbed.",
      "Inside is an assortment of completely useless matter: festival wristbands that have frayed at the edges, a handwritten note scribbled on a paper napkin from a bar that went out of business in 2017, a printed train ticket to Edinburgh, a broken silver chain.",
      "If you ask the owner, 'When was the last time you opened that box?' they will usually confess: 'Not in four years.' If you ask, 'Why don't you throw it away?' they look at you as though you suggested drowning a pet.",
      "The ritual of the shoebox is not about reminiscing. It is about containment. By sequestering the radioactive material inside a physical cardboard perimeter, you prevent it from contaminating the daily living room. The box allows you to say: 'My past exists, but it is under control beneath the flannel shirts.'",
    ],
    tags: ["Rituals", "Shoebox", "Containment", "Keepsakes"],
    relatedSlugs: [
      "what-an-old-receipt-can-remember",
      "the-emotional-weight-of-an-abandoned-key",
      "the-midnight-unsend",
    ],
    archiveEmotionFilter: "MEMORY",
  },
  {
    id: "rituals-02",
    slug: "the-midnight-unsend",
    title: "The Midnight Unsend",
    subtitle: "The modern digital ritual of sending an email to a dummy email address or draft folder just to experience the click of departure.",
    entryNumber: "NO. 0032",
    category: "small-rituals",
    seriesName: "Small Rituals",
    date: "July 2023",
    readingTime: "4 min",
    depth: "brief",
    palette: "charcoal",
    excerpt:
      "You type the email to an address you know doesn't exist, or to a dummy account you created for this single purpose. You click Send, hear the small paper airplane chime, and breathe.",
    paragraphs: [
      "In ancient Athens, citizens practiced the ritual of the scapegoat: an animal or object was loaded with the symbolic transgressions of the city and driven out into the wilderness. In the twenty-first century, we perform this ritual with mail servers.",
      "A surprising number of people describe an unusual private habit: when an unsaid sentiment becomes too heavy to contain in the chest, they open their email client, compose a full, unvarnished letter, and enter a recipient address that cannot receive it—a dummy inbox created years ago, or an old university address that has been deactivated.",
      "Then they press the Send button. The mail client produces that familiar, satisfying auditory chime: the swoosh of a departing letter. For a fraction of a second, the nervous system registers genuine release: *The words have left my body.*",
      "A minute later, a Mail Delivery Subsystem daemon bounces into the inbox: *'Delivery Status Notification (Failure) — Address not found.'* The writer doesn't care. The point was never for someone to receive it. The point was the physical sensation of letting go.",
    ],
    tags: ["Rituals", "Email", "Letting Go", "Catharsis"],
    relatedSlugs: [
      "the-afterlife-of-a-deleted-draft",
      "on-forgiving-people-who-will-never-know",
      "the-shoebox-under-the-wardrobe",
    ],
    archiveEmotionFilter: "REGRET",
  },
];

// Helper functions for easy consumption across components
export function getAllJournalEntries(): JournalEntry[] {
  return JOURNAL_ENTRIES;
}

export function getFeaturedJournalEntry(): JournalEntry {
  return JOURNAL_ENTRIES.find((entry) => entry.isFeatured) || JOURNAL_ENTRIES[0];
}

export function getJournalEntryBySlug(slug: string): JournalEntry | undefined {
  return JOURNAL_ENTRIES.find((entry) => entry.slug === slug);
}

export function getRelatedJournalEntries(currentEntry: JournalEntry, count: number = 3): JournalEntry[] {
  // 1. Direct slug matches
  const directMatches = currentEntry.relatedSlugs
    .map((slug) => getJournalEntryBySlug(slug))
    .filter((entry): entry is JournalEntry => Boolean(entry));

  if (directMatches.length >= count) {
    return directMatches.slice(0, count);
  }

  // 2. Category fallback
  const categoryFallback = JOURNAL_ENTRIES.filter(
    (entry) =>
      entry.id !== currentEntry.id &&
      entry.category === currentEntry.category &&
      !directMatches.some((m) => m.id === entry.id)
  );

  return [...directMatches, ...categoryFallback].slice(0, count);
}

export function filterJournalEntries(
  entries: JournalEntry[],
  categoryFilter: JournalCategory | "all" = "all",
  depthFilter: "all" | "brief" | "medium" | "deep" = "all",
  searchQuery: string = ""
): JournalEntry[] {
  return entries.filter((entry) => {
    // Category match
    if (categoryFilter !== "all" && entry.category !== categoryFilter) {
      return false;
    }

    // Depth match
    if (depthFilter !== "all" && entry.depth !== depthFilter) {
      return false;
    }

    // Search query match (title, subtitle, excerpt, tags, paragraphs)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = entry.title.toLowerCase().includes(q);
      const subtitleMatch = entry.subtitle.toLowerCase().includes(q);
      const excerptMatch = entry.excerpt.toLowerCase().includes(q);
      const tagsMatch = entry.tags.some((tag) => tag.toLowerCase().includes(q));
      const seriesMatch = entry.seriesName.toLowerCase().includes(q);
      const textMatch = entry.paragraphs.some((p) => p.toLowerCase().includes(q));

      return titleMatch || subtitleMatch || excerptMatch || tagsMatch || seriesMatch || textMatch;
    }

    return true;
  });
}
