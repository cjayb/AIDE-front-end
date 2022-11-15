import { createAxiosOrthancInstance } from "@/utils/axios-helpers";

const httpService = createAxiosOrthancInstance();

export interface ExpandedDicomTags {
    [key: string]: { Name: string; Type: string; Value: string };
}

export interface SimpleDicomTags {
    [key: string]: string;
}

interface FindResultItem {
    ID: string;
    IsStable: boolean;
    LastUpdate: string;
    ParentPatient: string;
    Series: string[];
    Type: string;
}

export interface SimpleFindResultItem extends FindResultItem {
    MainDicomTags: SimpleDicomTags;
    PatientMainDicomTags: SimpleDicomTags;
}

export async function findStudyMetadata(StudyInstanceUID: string): Promise<SimpleFindResultItem[]> {
    const response = await httpService.post<SimpleFindResultItem[]>(`/tools/find`, {
        Level: "Study",
        Expand: true,
        Limit: 101,
        Query: {
            StudyDate: "",
            StudyInstanceUID: StudyInstanceUID,
        },
        Full: false,
    });

    return response.data;
}
