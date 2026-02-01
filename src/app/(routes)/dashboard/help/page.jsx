"use client";

import { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lightbulb,
  Calculator,
  PieChart,
  Wallet,
  Bot,
} from "lucide-react";

/**
 * Help Page - Finova AI
 * Dieter Rams: "Good design makes a product understandable"
 */

const faqs = [
  {
    category: "Getting Started",
    icon: BookOpen,
    questions: [
      {
        q: "How do I create my first budget?",
        a: "Navigate to 'Budgets' in the sidebar, click 'Create New Budget', enter a name and amount, select an icon, and click save. Your budget will appear on the dashboard immediately.",
      },
      {
        q: "How do I add income sources?",
        a: "Go to 'Incomes' in the sidebar, click 'Add New Income', enter the income name (e.g., 'Salary', 'Freelance'), the amount, and save. Your total income will be reflected in your overview.",
      },
      {
        q: "How do I track expenses?",
        a: "You can add expenses in two ways: 1) Go to 'Expenses' and add a new expense with category, or 2) Click on any budget card and add expenses directly to that budget.",
      },
    ],
  },
  {
    category: "Budgeting",
    icon: Calculator,
    questions: [
      {
        q: "What is the 50/30/20 rule?",
        a: "The 50/30/20 rule suggests allocating 50% of income to needs (rent, utilities, groceries), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. Our AI advisor uses this framework to provide recommendations.",
      },
      {
        q: "How do I know if I'm over budget?",
        a: "Each budget card shows a progress bar. When you exceed your budget, the bar turns red and displays the overspend percentage. You'll also see warnings in your dashboard overview.",
      },
      {
        q: "Can I edit or delete a budget?",
        a: "Yes! Click on any budget card to view its details. You'll find edit and delete options there. Note: Deleting a budget will also remove all associated expenses.",
      },
    ],
  },
  {
    category: "AI Financial Advisor",
    icon: Bot,
    questions: [
      {
        q: "How does the AI advisor work?",
        a: "Our AI advisor, powered by Google Gemini, analyzes your income, expenses, and budgets to provide personalized financial advice. Simply open the chat and ask any financial question.",
      },
      {
        q: "Can I upload financial documents?",
        a: "Yes! You can upload PDF documents (bank statements, receipts) to the AI chat. The AI will analyze the document and provide insights based on the data it finds.",
      },
      {
        q: "Is my financial data secure?",
        a: "Your data is encrypted and stored securely. AI analysis is performed in real-time and document contents are not permanently stored. We follow industry-standard security practices.",
      },
    ],
  },
  {
    category: "Reports & Analytics",
    icon: PieChart,
    questions: [
      {
        q: "How do I view my spending trends?",
        a: "The dashboard overview includes a bar chart showing your spending across different budget categories. For detailed trends, check the Expenses page which shows all transactions with dates.",
      },
      {
        q: "Can I export my data?",
        a: "Currently, you can view all data within the app. Export functionality is coming in a future update. For now, you can screenshot or print any page for your records.",
      },
    ],
  },
];

const tips = [
  {
    icon: Lightbulb,
    title: "Set Realistic Budgets",
    description:
      "Start with your essential expenses, then allocate remaining funds to discretionary spending.",
  },
  {
    icon: Wallet,
    title: "Track Daily",
    description:
      "Log expenses as they happen to maintain accurate records and avoid end-of-month surprises.",
  },
  {
    icon: Calculator,
    title: "Review Weekly",
    description:
      "Spend 10 minutes each week reviewing your spending against budgets to stay on track.",
  },
  {
    icon: Bot,
    title: "Ask the AI",
    description:
      "Use the AI advisor for personalized tips based on your unique financial situation.",
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors px-4 -mx-4"
      >
        <span className="font-medium text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

function FAQCategory({ category, icon: Icon, questions }) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">{category}</h3>
      </div>
      <div className="space-y-0">
        {questions.map((faq, index) => (
          <FAQItem key={index} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Help Center</h1>
        </div>
        <p className="text-muted-foreground">
          Everything you need to know about managing your finances with Finova
        </p>
      </div>

      {/* Quick Tips */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                <tip.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium mb-1">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {faqs.map((category, index) => (
            <FAQCategory
              key={index}
              category={category.category}
              icon={category.icon}
              questions={category.questions}
            />
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Still need help?</h2>
            <p className="text-muted-foreground">
              Our support team is here to assist you with any questions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:support@finova.ai"
              className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Email Support</span>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Live Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { keys: ["⌘", "K"], action: "Open AI Chat" },
              { keys: ["⌘", "B"], action: "New Budget" },
              { keys: ["⌘", "E"], action: "New Expense" },
              { keys: ["⌘", "I"], action: "New Income" },
              { keys: ["⌘", "/"], action: "Open Help" },
              { keys: ["Esc"], action: "Close Modal" },
            ].map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-muted-foreground">{shortcut.action}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <kbd
                      key={keyIndex}
                      className="px-2 py-1 bg-muted rounded text-xs font-mono"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
