import { useState } from "react";
import { CollapsibleSidebar } from "@/components/layout/CollapsibleSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Survey, SKU, QuestionTemplate } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  PlusCircle,
  Users,
  CheckCircle,
  AlertCircle,
  Pencil,
  Trash,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const audiences = [
  { value: "gen_z_moms", label: "Gen Z moms" },
  { value: "urban_males_25_34", label: "Urban males 25-34" },
  { value: "existing_customers", label: "Existing customers" },
  { value: "competitive_brand_users", label: "Competitive brand users" },
];

const surveyTypes = [
  { value: "awareness", label: "Awareness Check" },
  { value: "message_recall", label: "Message Recall" },
  { value: "purchase_intent", label: "Purchase Intent" },
  { value: "friction_point", label: "Friction Point Analysis" },
];

const formSchema = z.object({
  skuId: z.string().min(1, { message: "Please select a SKU." }),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  type: z.string().min(1, { message: "Please select a survey type." }),
  audience: z.string().min(1, { message: "Please select an audience." }),
  sampleSize: z.number().min(50, { message: "Sample size must be at least 50." }),
});

const questionSchema = z.object({
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
  responseType: z.string().min(1, { message: "Please select a response type." }),
  options: z.any().optional(),
});

export default function SurveyBuilder() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch SKUs
  const { data: skus = [] } = useQuery<SKU[]>({
    queryKey: ["/api/skus"],
  });

  // Fetch surveys
  const { data: surveys = [], isLoading } = useQuery<Survey[]>({
    queryKey: ["/api/surveys"],
  });

  // Fetch question templates
  const { data: questionTemplates = [] } = useQuery<QuestionTemplate[]>({
    queryKey: ["/api/question-templates"],
  });

  // Filter surveys based on active tab
  const filteredSurveys = surveys.filter((survey) => {
    if (activeTab === "active") return survey.status === "active";
    if (activeTab === "draft") return survey.status === "draft";
    if (activeTab === "completed") return survey.status === "completed";
    return true;
  });

  // Form for creating new survey
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skuId: "",
      title: "",
      type: "",
      audience: "",
      sampleSize: 300,
    },
  });

  // Form for adding questions
  const questionForm = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      responseType: "",
      options: undefined,
    },
  });

  // Create survey mutation
  const createSurveyMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema> & { questions: any[] }) => {
      const response = await apiRequest("POST", "/api/surveys", {
        ...values,
        skuId: parseInt(values.skuId),
        status: "draft",
        questions: values.questions,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline-events"] });
      setIsCreateDialogOpen(false);
      form.reset();
      setQuestions([]);
      toast({
        title: "Survey Created",
        description: "The survey has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create survey. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update survey status mutation
  const updateSurveyStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/surveys/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/timeline-events"] });
      toast({
        title: "Survey Updated",
        description: "The survey status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update survey status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for creating new survey
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please add at least one question to the survey.",
        variant: "destructive",
      });
      return;
    }
    
    createSurveyMutation.mutate({ ...values, questions });
  };

  // Handle adding a question
  const onAddQuestion = (data: z.infer<typeof questionSchema>) => {
    setQuestions([...questions, data]);
    questionForm.reset();
    setIsQuestionDialogOpen(false);
  };

  // Handle selecting a question template
  const handleSelectTemplate = (template: QuestionTemplate) => {
    questionForm.setValue("question", template.question);
    questionForm.setValue("responseType", template.responseType);
    questionForm.setValue("options", template.options);
  };

  // Handle activating a draft survey
  const handleActivateSurvey = (survey: Survey) => {
    updateSurveyStatusMutation.mutate({
      id: survey.id,
      status: "active",
    });
  };

  // Handle completing an active survey
  const handleCompleteSurvey = (survey: Survey) => {
    updateSurveyStatusMutation.mutate({
      id: survey.id,
      status: "completed",
    });
  };

  // Handle filter by survey type
  const handleFilterByType = (type: string) => {
    // This would filter surveys by type in a real implementation
    toast({
      title: "Filter Applied",
      description: `Filtered surveys by type: ${type}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <CollapsibleSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6 max-w-7xl">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl lg:text-2xl font-bold">Survey Builder</h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Create and manage surveys to gather consumer insights
              </p>
            </div>
      <div className="flex justify-end mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
              <DialogDescription>
                Design a new survey to gather insights from your target audience.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="skuId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target SKU</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a SKU" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skus.map((sku) => (
                              <SelectItem
                                key={sku.id}
                                value={sku.id.toString()}
                              >
                                {sku.name} ({sku.region})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Survey Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., KitKat UK - Purchase Intent Survey"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Survey Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a survey type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {surveyTypes.map((type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {audiences.map((audience) => (
                              <SelectItem
                                key={audience.value}
                                value={audience.value}
                              >
                                {audience.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sampleSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample Size</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={50}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum required sample size is 50
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Survey Questions</h3>
                    <Dialog
                      open={isQuestionDialogOpen}
                      onOpenChange={setIsQuestionDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Add Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Question</DialogTitle>
                          <DialogDescription>
                            Create a question or select from templates
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4 py-4">
                          <div className="space-y-2">
                            <Label>Question Templates</Label>
                            <Select
                              onValueChange={(value) => {
                                const template = questionTemplates.find(
                                  (t) => t.id.toString() === value
                                );
                                if (template) {
                                  handleSelectTemplate(template);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                              <SelectContent>
                                {questionTemplates.map((template) => (
                                  <SelectItem
                                    key={template.id}
                                    value={template.id.toString()}
                                  >
                                    {template.question}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <form
                            onSubmit={questionForm.handleSubmit(onAddQuestion)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="question">Question</Label>
                              <Textarea
                                id="question"
                                placeholder="Enter your question here..."
                                {...questionForm.register("question")}
                              />
                              {questionForm.formState.errors.question && (
                                <p className="text-sm text-destructive">
                                  {questionForm.formState.errors.question.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="responseType">Response Type</Label>
                              <Select
                                onValueChange={(value) => {
                                  questionForm.setValue(
                                    "responseType",
                                    value
                                  );
                                  
                                  // Set default options based on response type
                                  if (value === "multiple_choice") {
                                    questionForm.setValue("options", {
                                      choices: ["Option 1", "Option 2", "Option 3"]
                                    });
                                  } else if (value === "rating") {
                                    questionForm.setValue("options", {
                                      min: 1,
                                      max: 5,
                                      labels: ["Very poor", "Excellent"]
                                    });
                                  } else {
                                    questionForm.setValue("options", undefined);
                                  }
                                }}
                                defaultValue={questionForm.getValues().responseType}
                              >
                                <SelectTrigger id="responseType">
                                  <SelectValue placeholder="Select response type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple_choice">
                                    Multiple Choice
                                  </SelectItem>
                                  <SelectItem value="rating">Rating Scale</SelectItem>
                                  <SelectItem value="open_ended">
                                    Open Ended
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {questionForm.formState.errors.responseType && (
                                <p className="text-sm text-destructive">
                                  {questionForm.formState.errors.responseType.message}
                                </p>
                              )}
                            </div>

                            <DialogFooter>
                              <Button type="submit">Add Question</Button>
                            </DialogFooter>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-2 opacity-30" />
                      <p>No questions added yet</p>
                      <p className="text-sm">
                        Click "Add Question" to start building your survey
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-3 bg-muted/30"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">
                                Q{index + 1}: {q.question}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                Type: {q.responseType.replace("_", " ")}
                              </p>
                              {q.responseType === "multiple_choice" && q.options?.choices && (
                                <div className="mt-2 space-y-1">
                                  {q.options.choices.map((choice: string, i: number) => (
                                    <div key={i} className="text-sm">
                                      • {choice}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.responseType === "rating" && q.options && (
                                <div className="mt-2 text-sm">
                                  Scale: {q.options.min}-{q.options.max}{" "}
                                  {q.options.labels && (
                                    <span>
                                      ({q.options.labels[0]} to{" "}
                                      {q.options.labels[1]})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newQuestions = [...questions];
                                newQuestions.splice(index, 1);
                                setQuestions(newQuestions);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createSurveyMutation.isPending || questions.length === 0}
                  >
                    {createSurveyMutation.isPending ? "Creating..." : "Create Survey"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Surveys
              </CardTitle>
              <CardDescription>
                Manage and track all your surveys across different SKUs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select onValueChange={handleFilterByType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {surveyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Draft
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <SurveyTable
                  surveys={filteredSurveys}
                  skus={skus}
                  audiences={audiences}
                  onComplete={handleCompleteSurvey}
                  status="active"
                />
              )}
            </TabsContent>

            <TabsContent value="draft">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <SurveyTable
                  surveys={filteredSurveys}
                  skus={skus}
                  audiences={audiences}
                  onActivate={handleActivateSurvey}
                  status="draft"
                />
              )}
            </TabsContent>

            <TabsContent value="completed">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <SurveyTable
                  surveys={filteredSurveys}
                  skus={skus}
                  audiences={audiences}
                  status="completed"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {surveys.length} surveys total
          </div>
        </CardFooter>
      </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SurveyTableProps {
  surveys: Survey[];
  skus: SKU[];
  audiences: { value: string; label: string }[];
  onActivate?: (survey: Survey) => void;
  onComplete?: (survey: Survey) => void;
  status: "active" | "draft" | "completed";
}

function SurveyTable({ surveys, skus, audiences, onActivate, onComplete, status }: SurveyTableProps) {
  if (surveys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileText className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">No {status} surveys found</p>
        <p className="text-sm">
          {status === "draft"
            ? "Create a new survey to get started"
            : status === "active"
            ? "Activate a draft survey to see it here"
            : "Complete an active survey to see it here"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead className="text-center">Sample Size</TableHead>
            <TableHead className="text-center">Questions</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey) => {
            const sku = skus.find((s) => s.id === survey.skuId);
            const audience = audiences.find((a) => a.value === survey.audience);
            
            return (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.title}</TableCell>
                <TableCell>
                  {sku ? `${sku.name} (${sku.region})` : `SKU ID: ${survey.skuId}`}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {survey.type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{audience?.label || survey.audience}</TableCell>
                <TableCell className="text-center">{survey.sampleSize}</TableCell>
                <TableCell className="text-center">
                  {survey.questions?.length || 0}
                </TableCell>
                <TableCell>
                  {format(new Date(survey.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  {status === "draft" && onActivate && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => onActivate(survey)}
                    >
                      Activate
                    </Button>
                  )}
                  {status === "active" && onComplete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => onComplete(survey)}
                    >
                      Complete
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
