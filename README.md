# <img width="30" height="30" alt="icon" src="https://github.com/user-attachments/assets/dc7da4a4-a225-4761-b78c-f480a7bfae55" /> Stack Overflow Mentor - Chrome Extension 

 

## Overview

Stack Overflow Mentor is an intelligent Chrome extension that helps developers write better questions on Stack Overflow. By analyzing your question in real-time as you type, it provides actionable suggestions to improve clarity, add necessary details, and avoid common pitfalls. The extension also identifies potential duplicate questions, helping you find existing solutions faster and reduce duplicate content on Stack Overflow.

## Key Features

- **Real-time Question Analysis**: Get instant feedback as you type your question
- **AI-Powered Suggestions**: Natural Language Processing identifies vague language and missing elements
- **Duplicate Detection**: Finds similar questions before you post
- **Quality Scoring**: See your question's quality score improve as you make changes
- **Non-Intrusive Interface**: Suggestions appear in a sidebar without blocking your content
- **Performance Optimized**: Redis caching and throttled API calls ensure smooth performance

## How It Works

```
User Types Question → NLP Analysis → Quality Assessment → Suggestions Generated
                                ↓
Stack Overflow API ← Duplicate Detection ← Redis Cache Check
                                ↓
                    Display Results in Sidebar
```

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **TypeScript**: Static typing for JavaScript
- **Natural**: NLP library for text analysis
- **Redis**: In-memory data store for caching
- **Axios**: HTTP client for API requests
- **Docker**: Containerization for deployment

### Frontend (Extension)
- **Chrome Extension API**: Browser extension functionality
- **HTML/CSS**: UI components and styling
- **TypeScript**: Content and background scripts

### APIs
- **Stack Overflow API**: For finding similar questions
- **Redis Cloud**: Managed Redis service

## Getting Started

### Prerequisites

- Node.js v16+
- Redis instance (local or cloud)
- Chrome browser
- Stack Overflow API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/stack-overflow-mentor.git
   cd stack-overflow-mentor
   ```

2. **Install backend dependencies:**
   ```bash
   cd som-backend
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in `som-backend`:
   ```env
   REDIS_API_URL=your_redis_url
   STACKOVERFLOW_API_KEY=your_stackoverflow_api_key
   PORT=3000
   ```

4. **Build and run the backend:**
   ```bash
   npm run build
   npm start
   ```

5. **Load the Chrome extension:**
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory from the project

## Configuration

| Environment Variable | Description | Required |
|---------------------|-------------|----------|
| `REDIS_API_URL` | URL for your Redis instance | Yes |
| `STACKOVERFLOW_API_KEY` | API key for Stack Overflow API | Yes |
| `PORT` | Port for backend server (default: 3000) | No |

## Usage

1. Go to Stack Overflow's "Ask Question" page
2. Start typing your question in the editor
3. See real-time suggestions in the sidebar:
   - Quality score of your question
   - Specific suggestions for improvement
   - Potential duplicate questions
4. Click on duplicate links to view similar questions
5. Improve your question based on the feedback

## Features in Detail

### Intelligent Suggestions
- Identifies vague phrases like "it doesn't work"
- Recommends adding code examples when missing
- Suggests adding more details for short questions
- Quality score updates in real-time

### Duplicate Detection
- Searches Stack Overflow for similar questions
- Shows top 3 most relevant matches
- Displays vote counts and answer status
- Direct links to potential solutions

### Performance Optimization
- Redis caching for API responses (24-hour TTL)
- Throttled requests (1 per second)
- Efficient NLP processing
- Dockerized deployment

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   Backend       │    │   Stack         │
│   Extension     │◄──►│   Server        │◄──►│   Overflow API  │
│                 │    │   (Node.js)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │                 │
                       └─────────────────┘
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

### Areas for Contribution
- Improve NLP analysis
- Add more suggestion categories
- Enhance UI/UX design
- Implement user settings/preferences
- Add support for other Stack Exchange sites

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Stack Overflow for their invaluable API
- Redis for providing an excellent caching solution
- Natural library developers for NLP capabilities
- Chrome Extension API documentation team

---

**Transform your Stack Overflow experience - write better questions, get better answers!**
