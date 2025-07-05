import { SidebarLayout } from "@/components/sidebar-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, BookOpen, Trophy, Calendar, Settings } from "lucide-react"

export default function ProfilePage() {
  return (
    <SidebarLayout>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <SidebarTrigger className="text-purple-600 hover:text-purple-700" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Study Profile
              </h1>
              <p className="text-sm text-gray-500">Track your learning journey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">S</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Study Profile</h2>
            <p className="text-gray-600">Track your learning journey with TalkGPT</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">42</div>
                <p className="text-xs text-gray-500">+12 this week</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
                <BookOpen className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-600">28</div>
                <p className="text-xs text-gray-500">+5 this week</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">7 days</div>
                <p className="text-xs text-gray-500">Keep it up! 🔥</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest study sessions with TalkGPT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">Math Problem Solving</p>
                    <p className="text-sm text-gray-500">Worked on calculus derivatives</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  2 hours ago
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">History Essay Help</p>
                    <p className="text-sm text-gray-500">Created outline for World War II essay</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  Yesterday
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">Science Quiz Prep</p>
                    <p className="text-sm text-gray-500">Generated flashcards for chemistry</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  2 days ago
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <span>Study Preferences</span>
              </CardTitle>
              <CardDescription>Customize your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Preferred Study Style</p>
                  <p className="text-sm text-gray-500">Visual learner with step-by-step explanations</p>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Visual</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Favorite Subjects</p>
                  <p className="text-sm text-gray-500">Mathematics, Science, History</p>
                </div>
                <div className="flex space-x-1">
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    Math
                  </Badge>
                  <Badge variant="outline" className="border-pink-200 text-pink-700">
                    Science
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    History
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Study Reminders</p>
                  <p className="text-sm text-gray-500">Daily notifications at 7:00 PM</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <a href="/">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start New Chat
              </a>
            </Button>
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Edit Preferences
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}