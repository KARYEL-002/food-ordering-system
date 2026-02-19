flowchart LR
  %% Swimlane-style layout using subgraphs for roles
  %% Roles: College Admin | Program Chair | Faculty
  subgraph Admin["College Admin"]
    direction TB
    A(Start)
    M1[/"Manage College\nUpdate college details: email, tel, website"/]
    M2["Manage College Competencies\nCreate/Edit/Delete competencies (SDG, CDIO, IGA, SO)"]
    AssignPC["Assign Program Chairs\nSelect & assign chairs for programs"]
    M6["Manage Program Career & Skills\nCreate/Edit/Delete program careers & skill sets"]
    ViewApprove["View & Approve CIS\nView CIS -> Update status to Approved"]
  end

  subgraph Chair["Program Chair"]
    direction TB
    PCmap["Manage Program Competency Mappings\nCreate/Edit/Delete program competency mappings (SDG-SO, IGA-SO)"]
    ReviewCIS["Review CIS (for approval)"]
  end

  subgraph Faculty["Faculty"]
    direction TB
    CourseSOMap["Manage Course SO Mappings\nAdd/Delete mapped SO per course"]
    ViewSections["View Class Sections\nSubject load & enrolled students"]
    Grading["View/Export Grading Sheet\nSyllabus, Grading Sheet, Outcome Performance"]
    ExportAttain["Export Section Attainment\nExport PDF of section attainment"]
  end

  subgraph ExportArea["Export Actions"]
    direction TB
    ExportCIS["Export CIS\nExport PDF of CIS"]
    ExportGrading["Export Grading Sheet PDF"]
  end

  End([END])

  %% Main linear flow for Admin actions
  A --> M1 --> M2 --> AssignPC
  AssignPC --> M6

  %% Parallel branches after assigning program chairs
  AssignPC --> PCmap
  AssignPC --> CourseSOMap

  %% Flow for CIS approval with decision
  PCmap --> ReviewCIS
  M6 --> ViewApprove
  ReviewCIS --> ViewApprove
  ViewApprove --> DecisionCIS{CIS Approved?}
  DecisionCIS -- Yes --> ExportCIS
  DecisionCIS -- No --> UpdateLoop["Update CIS / Request Changes"]
  UpdateLoop --> ReviewCIS

  %% Faculty flows
  CourseSOMap --> ViewSections --> Grading --> ExportGrading --> ExportAttain --> End

  %% Export completion
  ExportCIS --> End

  %% Cross-role links (clarify responsibilities)
  PCmap -.-> CourseSOMap
  ReviewCIS -.-> ViewSections