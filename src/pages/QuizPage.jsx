import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  styled,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress, // Import LinearProgress
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SectionTemplate from "../components/sections/SectionTemplate";
import Quiz from "../components/tutorial/Quiz";
import { useProgress } from "../contexts/ProgressContext";

// Import all quizzes
import { historicalQuiz } from "../data/quizzes/historicalQuiz";
import { identitiesQuiz } from "../data/quizzes/identitiesQuiz";
import { legalQuiz } from "../data/quizzes/legalQuiz";
import { challengesQuiz } from "../data/quizzes/challengesQuiz";
import { socialProgressQuiz } from "../data/quizzes/socialProgressQuiz";

const StyledTab = styled(Tab)(({ theme, active }) => ({
  fontWeight: active ? "bold" : "normal",
  color: active ? theme.palette.primary.main : "inherit",
  borderBottom: active ? `2px solid ${theme.palette.primary.main}` : "none",
}));

const quizzes = {
  historical: historicalQuiz,
  identities: identitiesQuiz,
  legal: legalQuiz,
  challenges: challengesQuiz,
  social: socialProgressQuiz,
  resources: null,
  glossary: null,
};

const subsections = [
  { title: "Historical", id: "historical" },
  { title: "Identities", id: "identities" },
  { title: "Legal", id: "legal" },
  { title: "Challenges", id: "challenges" },
  { title: "Social", id: "social" },
  { title: "Resources", id: "resources" },
  { title: "Glossary", id: "glossary" },
];

const QuizPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { markAsCompleted, markPageAsVisited, getSectionCompletion } =
    useProgress();

  const [activeTab, setActiveTab] = useState("historical");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const [completedSections, setCompletedSections] = useState({});

  // Get only available quiz sections
  const availableSubsections = subsections.filter(section => quizzes[section.id]);

  // Find the active section index
  const activeIndex = availableSubsections.findIndex(
    section => section.id === activeTab
  );

  useEffect(() => {
    markPageAsVisited("/quiz");

    const initialCompletedSections = {};
    subsections.forEach((section) => {
      if (quizzes[section.id]) {
        initialCompletedSections[section.id] =
          getSectionCompletion(section.id) > 0;
      }
    });
    setCompletedSections(initialCompletedSections);
  }, [markPageAsVisited, getSectionCompletion]);

  const currentQuiz = quizzes[activeTab] || quizzes.historical;

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    setQuizCompleted(completedSections[newValue] || false);
    setQuizKey((prevKey) => prevKey + 1);
    setDrawerOpen(false);
  };

  const handleQuizComplete = () => {
    markAsCompleted(activeTab, "quiz");
    setQuizCompleted(true);

    setCompletedSections((prev) => ({
      ...prev,
      [activeTab]: true,
    }));
  };

  const handleNextSection = () => {
    const currentIndex = availableSubsections.findIndex(
      (section) => section.id === activeTab
    );

    if (currentIndex < availableSubsections.length - 1) {
      const nextSectionId = availableSubsections[currentIndex + 1].id;
      setActiveTab(nextSectionId);
      setQuizCompleted(completedSections[nextSectionId] || false);
      setQuizKey((prevKey) => prevKey + 1);
    }
  };

  const handlePreviousSection = () => {
    const currentIndex = availableSubsections.findIndex(
      (section) => section.id === activeTab
    );

    if (currentIndex > 0) {
      const prevSectionId = availableSubsections[currentIndex - 1].id;
      setActiveTab(prevSectionId);
      setQuizCompleted(completedSections[prevSectionId] || false);
      setQuizKey((prevKey) => prevKey + 1);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const availableSections = subsections.filter(
    (section) => quizzes[section.id]
  ).length;
  const completedCount =
    Object.values(completedSections).filter(Boolean).length;
  const progressPercentage =
    availableSections > 0 ? (completedCount / availableSections) * 100 : 0;

  const quizTitle =
    activeTab === "historical" ? "Historical Context of LGBTQAI+ Advocacy in India" :
    activeTab === "identities" ? "Sexual Orientation and Gender Identity" :
    activeTab === "legal" ? "Legal Landscape for LGBTQAI+ Individuals in India" :
    activeTab === "challenges" ? "Social and Cultural Challenges" :
    activeTab === "social" ? "Social Challenges and Progress" :
    "LGBTQAI+ Advocacy in India";

  // Mobile Progress Indicator and Drawer Toggle
  const renderMobileProgress = () => (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, justifyContent: 'space-between' }}>
        <IconButton onClick={toggleDrawer} edge="start">
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {`${completedCount}/${availableSections} Completed`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{ width: 100, height: 8, borderRadius: 4 }} // Use LinearProgress
          />
        </Box>

      </Box>
      {/* Current quiz section indicator */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="h6" noWrap component="div">
          {activeIndex + 1}. {availableSubsections[activeIndex]?.title}
        </Typography>
      </Box>
    </Paper>
  );



  // Mobile drawer for section navigation
  const renderDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <Box sx={{ p: 2, backgroundColor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h6">Quiz Sections</Typography>
          <Typography variant="body2">{completedCount}/{availableSections} Completed</Typography>
        </Box>
        <Divider />
        <List>
          {availableSubsections.map((section, index) => (
            <ListItem
              button
              key={section.id}
              onClick={() => handleTabChange(section.id)}
              selected={activeTab === section.id}
              sx={{
                backgroundColor: activeTab === section.id ? theme.palette.action.selected : 'inherit'
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: completedSections[section.id]
                          ? theme.palette.success.main
                          : theme.palette.grey[300],
                        color: completedSections[section.id] ? 'white' : theme.palette.text.primary,
                        mr: 2
                      }}
                    >
                      {completedSections[section.id] ? <CheckCircleIcon fontSize="small" /> : index + 1}
                    </Box>
                    {section.title}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  // Navigation buttons for mobile
  const renderMobileNavigation = () => (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      mt: 4,
      pb: 2,
      position: 'sticky',
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
      borderTop: `1px solid ${theme.palette.divider}`,
      pt: 2
    }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={handlePreviousSection}
        disabled={activeIndex === 0}
        sx={{ flex: 1, mr: 1 }}
      >
        Previous
      </Button>

      <Button
        variant="contained"
        color="primary"
        endIcon={<ArrowForwardIcon />}
        onClick={handleNextSection}
        disabled={
          activeIndex === availableSubsections.length - 1 ||
          !quizCompleted
        }
        sx={{ flex: 1, ml: 1 }}
      >
        Next
      </Button>
    </Box>
  );

  // Desktop stepper navigation (alternative to tabs)
  const renderDesktopStepper = () => (
    <Box sx={{ mb: 3 }}>
      <Stepper
        activeStep={activeIndex}
        nonLinear
        alternativeLabel
      >
        {availableSubsections.map((section, index) => (
          <Step key={section.id} completed={completedSections[section.id]}>
            <StepButton onClick={() => handleTabChange(section.id)}>
              {section.title}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );

  return (
    <SectionTemplate
      sectionId={activeTab}
      title={`Quiz: ${quizTitle}`}
      subtitle="Test your knowledge and understanding"
      introduction={{
        title: "Knowledge Check",
        description:
          currentQuiz?.description ||
          "Answer the following questions to test your understanding of this section.",
      }}
      activeSubsection="quiz"
      progress={progressPercentage} // Keep passing progress for the desktop view
      renderCustomSubsections={() => (
        isMobile ? renderMobileProgress() : renderDesktopStepper()
      )}
    >
      {/* Mobile navigation drawer */}
      {isMobile && renderDrawer()}

      {currentQuiz ? (
        <>
          <Quiz
            key={`quiz-${activeTab}-${quizKey}`}
            questions={currentQuiz?.questions}
            sectionId={activeTab}
            onComplete={handleQuizComplete}
          />

          {isMobile ? (
            // Mobile navigation buttons
            renderMobileNavigation()
          ) : (
            // Desktop navigation button
            quizCompleted && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={handlePreviousSection}
                  disabled={activeIndex === 0}
                >
                  Previous Section
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNextSection}
                  disabled={activeIndex === availableSubsections.length - 1}
                >
                  Next Section
                </Button>
              </Box>
            )
          )}
        </>
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">
            This quiz section is coming soon!
          </Typography>
        </Box>
      )}
    </SectionTemplate>
  );
};

export default QuizPage;