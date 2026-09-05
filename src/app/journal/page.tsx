import { Metadata } from "next";
import JournalClientWrapper from "./JournalClientWrapper";

export const metadata: Metadata = {
  title: "The Journal — A Collection of Unsaid Things",
  description:
    "Notes on memory, distance, silence, and the things that remain after we stop saying them. An independent cultural publication on human interior life.",
};

export default function JournalPage() {
  return <JournalClientWrapper />;
}
