# CoachMe AI: Your Goal Companion

You are a Senior Full-Stack Software Engineer, UI/UX Designer, AI Engineer, Database Architect, and Software Architect.

Your task is to build my complete major project from the documentation I provide.

Project Name:

CoachMe AI – Your Personal AI Coach for Every Goal

IMPORTANT

The uploaded documents are the ONLY source of truth.

These include:

• PRD (Product Requirements Document)

• SOP (Standard Operating Procedure)

• DSD (Detailed Software Design Document)

• TSD (Technical Stack Document)

Follow these documents exactly.

Do NOT remove features.

Do NOT simplify functionality.

Do NOT replace features with placeholders.

Do NOT invent unrelated functionality.

If multiple documents overlap, prioritize them in this order:

1. PRD

2. SOP

3. DSD

4. TSD

------------------------------------------------

PROJECT GOAL

------------------------------------------------

CoachMe AI is NOT just another chatbot.

It is an AI-powered adaptive coaching platform that continuously learns about the user and helps them achieve goals related to:

• Academics

• Career

• Fitness

• Sports

• Personal Growth

The AI should:

• Learn user preferences

• Remember progress

• Adapt coaching style

• Generate personalized plans

• Track habits

• Generate reports

• Analyze uploaded images

• Recommend opportunities

The AI should feel like a real personal coach.

------------------------------------------------

TECH STACK

------------------------------------------------

Frontend

• Next.js (JavaScript)

• React

• Tailwind CSS

• CSS3

• React Context API

• React Hooks

• Recharts

Backend

• Next.js API Routes (only when necessary)

• Supabase

Database

• PostgreSQL (Supabase)

Authentication

• Supabase Authentication

AI

• Groq API

• Groq Vision API

Deployment

• Vercel

Version Control

• Git

• GitHub

------------------------------------------------

DESIGN REQUIREMENTS

------------------------------------------------

Create an ORIGINAL premium futuristic interface.

Do NOT copy any copyrighted UI.

Design Style

• Dark Theme

• Glassmorphism

• Neon Green Accent

• Soft Glow

• Rounded Cards

• AI Dashboard Style

• Modern Analytics

• Floating Animations

• Minimal UI

• Responsive Layout

Use smooth transitions.

Use loading animations.

Use skeleton loaders.

Use beautiful empty states.

------------------------------------------------

APPLICATION MODULES

------------------------------------------------

Authentication

• Sign Up

• Login

• Forgot Password

• Protected Routes

--------------------------------

Onboarding

Collect

• Name

• Age

• Interests

• Sports

• Career Goals

• Academic Goals

• Fitness Goals

• Learning Style

• Daily Routine

Generate AI Profile.

--------------------------------

Dashboard

Display

Greeting

Today's Progress

Goal Completion

Habit Streak

Upcoming Tasks

AI Insights

Weekly Summary

Quick Actions

--------------------------------

Goal Management

Create

Update

Delete

Archive

Categorize

Prioritize

Deadline Management

--------------------------------

Planner

Daily Planner

Weekly Planner

Adaptive Scheduling

--------------------------------

Habit Tracker

Daily Habits

Longest Streak

Current Streak

Completion Percentage

--------------------------------

AI Adaptive Coaching Engine

Generate

Study Plans

Workout Plans

Career Plans

Sports Practice Plans

Personal Development Plans

The coaching should improve continuously.

--------------------------------

AI Chat

Conversational coach

Career Advice

Study Guidance

Fitness Coaching

Motivation

--------------------------------

AI Vision

Allow image uploads.

Analyze

Study Notes

Workout Images

Coding Screenshots

Sports Technique

Return actionable feedback.

--------------------------------

Progress Analytics

Display

Charts

Weekly Score

Monthly Score

Goal Completion

Mood Trends

Study Hours

Workout Progress

Habit Trends

--------------------------------

Weekly Reports

Automatically generate

Strengths

Weaknesses

Achievements

Improvement Suggestions

Overall Score

--------------------------------

Recommendations

Recommend

Courses

Internships

Scholarships

Competitions

Sports Events

Certifications

based on user profile and goals.

------------------------------------------------

DATABASE

------------------------------------------------

Create normalized Supabase tables.

users

profiles

goals

planner

habits

progress

reports

recommendations

vision_analysis

chat_history

notifications

------------------------------------------------

ALGORITHMS

------------------------------------------------

Implement JavaScript logic for

Goal Prioritization

Adaptive Scheduling

Habit Streak Calculation

Progress Percentage

Weekly Performance Score

Recommendation Ranking

Mood Trend Analysis

Opportunity Matching

These should be implemented as reusable utility functions.

------------------------------------------------

PROJECT STRUCTURE

------------------------------------------------

Use scalable architecture.

app/

components/

hooks/

context/

lib/

services/

utils/

styles/

public/

supabase/

------------------------------------------------

CODING STANDARDS

------------------------------------------------

Use reusable components.

Avoid duplicate code.

Keep files modular.

Follow clean architecture.

Use environment variables.

Handle API errors gracefully.

Validate user inputs.

Display proper loading states.

Display proper error messages.

Use responsive design.

Optimize performance.

------------------------------------------------

OUTPUT REQUIREMENTS

------------------------------------------------

Generate production-ready code.

Every screen should be functional.

Connect all forms to Supabase.

Connect AI features to Groq APIs.

Do not generate dummy data unless explicitly requested.

Prepare the project for deployment on Vercel.

Use GitHub-friendly folder structure.

Generate maintainable and scalable code.

------------------------------------------------

DEVELOPMENT STRATEGY

------------------------------------------------

Do NOT generate the entire project in one step.

Instead, build incrementally.

Phase 1

Project setup

Phase 2

Authentication

Phase 3

Database

Phase 4

Onboarding

Phase 5

Dashboard

Phase 6

Goal Management

Phase 7

Planner

Phase 8

Habit Tracker

Phase 9

AI Chat

Phase 10

AI Vision

Phase 11

Reports

Phase 12

Recommendations

Phase 13

Testing

Phase 14

Deployment

After completing each phase:

• Verify functionality.

• Check for bugs.

• Refactor code.

• Maintain consistency with the uploaded documentation.

• Continue to the next phase only after the current phase is complete.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d3654a66-11d0-460e-beee-b99b5dd48312).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
