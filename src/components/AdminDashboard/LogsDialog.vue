<template>
    <v-dialog transition="dialog-bottom-transition" max-width="60vw" v-model="dialog2">
        <template v-slot:default="dialog2">
            <v-card>
                <v-toolbar color="#61366e" dark>Log Viewer</v-toolbar>
                <v-card-text style="height: 60vh; overflow: scroll !important">
                    <vue-json-pretty :path="'res'" :data="logs" showLine> </vue-json-pretty>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="dialog2.value = false">Download Logs</v-btn>
                    <v-btn text @click="dialog2.value = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

@Component({
    components: { VueJsonPretty },
})
export default class LogsDialog extends Vue {
    dialog2 = false;

    logs = [
        {
            written_at: "2021-07-09T07:58:12.438Z",
            written_ts: 1625817492438923000,
            msg: "Starting DIMSE C-STORE AE on address=('0.0.0.0', 8081) aet={self.ae.ae_title}",
            type: "log",
            logger: "logger",
            thread: "MainThread",
            level: "INFO",
            module: "scp",
            line_no: 208,
        },
        {
            written_at: "2021-07-09T07:59:58.655Z",
            written_ts: 1625817598655614000,
            msg: "Connected with remote at ('127.0.0.1', 63574)",
            type: "log",
            logger: "logger",
            thread: "MainThread",
            level: "INFO",
            module: "scp",
            line_no: 70,
            collaboration_id: "AcceptorThread@20210709085958",
        },
        {
            written_at: "2021-07-09T07:59:58.838Z",
            written_ts: 1625817598838650000,
            msg: "Created Directory",
            type: "log",
            logger: "logger",
            thread: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            level: "INFO",
            module: "storage",
            line_no: 33,
            collaboration_id: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            data: {
                directory:
                    "mnt/efs_data/1CT1/1-3-6-1-4-1-5962-1-2-1-20040119072730-12322/1-3-6-1-4-1-5962-1-3-1-1-20040119072730-12322",
            },
        },
        {
            written_at: "2021-07-09T07:59:58.850Z",
            written_ts: 1625817598850651000,
            msg: "Wrote file",
            type: "log",
            logger: "logger",
            thread: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            level: "INFO",
            module: "storage",
            line_no: 65,
            collaboration_id: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            data: {
                file: "1.3.6.1.4.1.5962.1.1.1.1.1.20040119072730.12322.dcm",
            },
        },
        {
            written_at: "2021-07-09T07:59:58.861Z",
            written_ts: 1625817598861647000,
            msg: "Processed C-STORE Event",
            type: "log",
            logger: "logger",
            thread: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            level: "INFO",
            module: "scp",
            line_no: 110,
            collaboration_id: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            data: {
                CallingAET: "1.3.6.1.4.1.5962.1.1.1.1.1.20040119072730.12322",
                SopInstanceUID: "1.3.6.1.4.1.5962.1.1.1.1.1.20040119072730.12322",
                StudyInstanceUID: "1.3.6.1.4.1.5962.1.2.1.20040119072730.12322",
                Modality: "CT",
            },
        },
        {
            written_at: "2021-07-09T07:59:58.946Z",
            written_ts: 1625817598946650000,
            msg: "Disconnected from remote at ('127.0.0.1', 63574)",
            type: "log",
            logger: "logger",
            thread: "Thread-1",
            level: "INFO",
            module: "scp",
            line_no: 132,
            collaboration_id: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
        },
        {
            written_at: "2021-07-09T07:59:58.976Z",
            written_ts: 1625817598976651000,
            msg: "Sent message to queue",
            type: "log",
            logger: "logger",
            thread: "Thread-1",
            level: "INFO",
            module: "producer",
            line_no: 59,
            collaboration_id: "a450fc51-cce6-418f-94f4-f4aa8f31177b",
            data: {
                queue: "input",
                message:
                    '{"type": "DICOM", "collaboration_uid": "a450fc51-cce6-418f-94f4-f4aa8f31177b", "study_uid": "", "timestamp": "{\\"dicom_received\\": 1625813998.655614}", "series": [{"series_uid": "1.3.6.1.4.1.5962.1.3.1.1.20040119072730.12322", "filepaths": ["mnt/efs_data/1CT1/1-3-6-1-4-1-5962-1-2-1-20040119072730-12322/1-3-6-1-4-1-5962-1-3-1-1-20040119072730-12322\\\\1.3.6.1.4.1.5962.1.1.1.1.1.20040119072730.12322.dcm"], "metadata": {"SpecificCharacterSet": "ISO_IR 100", "ImageType": ["ORIGINAL", "PRIMARY", "AXIAL"], "InstanceCreationDate": "20040119", "InstanceCreationTime": "072731", "InstanceCreatorUID": "1.3.6.1.4.1.5962.3", "SOPClassUID": "1.2.840.10008.5.1.4.1.1.2", "SOPInstanceUID": "1.3.6.1.4.1.5962.1.1.1.1.1.20040119072730.12322", "StudyDate": "20040119", "SeriesDate": "19970430", "AcquisitionDate": "19970430", "ContentDate": "19970430", "StudyTime": "072730", "SeriesTime": "112749", "AcquisitionTime": "112936", "ContentTime": "113008", "AccessionNumber": "", "Modality": "CT", "Manufacturer": "GE MEDICAL SYSTEMS", "InstitutionName": "JFK IMAGING CENTER", "ReferringPhysiciansName": "", "TimezoneOffsetFromUTC": "-0500", "StationName": "CT01_OC0", "StudyDescription": "e+1", "ManufacturersModelName": "RHAPSODE", "PrivateCreator": "GEMS_PARM_01", "Serviceid": null, "Mobilelocationnumber": null, "PatientsName": ["C", "o", "m", "p", "r", "e", "s", "s", "e", "d", "S", "a", "m", "p", "l", "e", "s", "^", "C", "T", "1"], "PatientID": "1CT1", "PatientsBirthDate": "", "PatientsSex": "O", "PatientsAge": "000Y", "PatientsWeight": 0.0, "AdditionalPatientHistory": "", "ContrastBolusAgent": "ISOVUE300/100", "ScanOptions": "HELICAL MODE", "SliceThickness": 5.0, "KVP": 120.0, "SpacingBetweenSlices": 5.0, "DataCollectionDiameter": 480.0, "SoftwareVersions": "05", "ContrastBolusRoute": "IV", "ReconstructionDiameter": 338.6716, "DistanceSourcetoDetector": 1099.3100585938, "DistanceSourcetoPatient": 630.0, "GantryDetectorTilt": 0.0, "TableHeight": 133.699997, "ExposureTime": 1601, "XRayTubeCurrent": 170, "Exposure": 170, "FilterType": "LARGE BOWTIE FIL", "FocalSpots": 0.7, "ConvolutionKernel": "STANDARD", "PatientPosition": "FFS", "StudyInstanceUID": "1.3.6.1.4.1.5962.1.2.1.20040119072730.12322", "SeriesInstanceUID": "1.3.6.1.4.1.5962.1.3.1.1.20040119072730.12322", "StudyID": "1CT1", "SeriesNumber": 1, "AcquisitionNumber": 2, "InstanceNumber": 1, "ImagePositionPatient": [-158.135803, -179.035797, -75.699997], "ImageOrientationPatient": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0], "FrameofReferenceUID": "1.3.6.1.4.1.5962.1.4.1.1.20040119072730.12322", "Laterality": "", "PositionReferenceIndicator": "SN", "SliceLocation": -77.2040634155, "ImageComments": "Uncompressed", "Anatomicalreferenceforscout": null, "PrimaryReceiverSuiteandHost": null, "ForeignImageRevision": null, "SamplesperPixel": 1, "PhotometricInterpretation": "MONOCHROME2", "Rows": 128, "Columns": 128, "PixelSpacing": [0.661468, 0.661468], "BitsAllocated": 16, "BitsStored": 16, "HighBit": 15, "PixelRepresentation": 1, "PixelPaddingValue": -2000, "RescaleIntercept": -1024.0, "RescaleSlope": 1.0, "LowerrangeofPixels1": null}}], "studyUID": "1.3.6.1.4.1.5962.1.2.1.20040119072730.12322"}',
            },
        },
    ];

    created(): void {
        EventBus.$on("openLogsDialog", (dialog2: boolean) => {
            this.dialog2 = dialog2;
        });
    }
}
</script>
