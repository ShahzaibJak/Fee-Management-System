import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#E4E4E4",
        padding: 20,
        fontSize: 12,
        fontWeight:"extralight",
        border: "3px solid black"
    },

    feeBill: {
        padding: 20,
        fontSize: 12,
        border: "3px solid black"
    },

    header: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 7,
        fontWeight:"demibold"
    },
    subheading: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 10,
        fontWeight: "bold"
    },
    section: {
        marginBottom: 10,
    },
    feesection: {
        marginBottom: 10,
        padding: 10,
        border: "2px solid black"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    feerow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        borderBottom: "1px solid black"
    },

    label: {
        fontWeight: "bold",
        width: "50%",
    },
    value: {
        fontWeight: "medium",
        width: "50%",
    },

    feelabel: {
        fontWeight: "bold",
        width: "70%",
    },
    feevalue: {
        fontWeight: "medium",
        width: "30%",
    },
});

interface propType {
    challan: {
        rollNo: string;
        monthYear: string;
        date: string;
        dueDate: string;
        studentName: string;
        studentClass: string;
        monthlyFee: number;
        admissionFee: number;
        previousDues: number;
        studentId: string;
        status: string;
        totalFee: number;
        userid: string;
        id: string;
    } | null;
}

export const ChallanPrint = (props: propType) => {
    const { challan } = props;

    if (!challan) {
        return null;
    }

    const includePreviousDues = challan.previousDues !== 0;
    const includeAdmissionFee = challan.admissionFee !== 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.feeBill}>
                    <Text style={styles.header}>The Lessons School</Text>
                    <Text style={styles.subheading}>School Address</Text>
                    <hr></hr>
                    <br></br><br></br>

                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Student Name</Text>
                            <Text style={styles.value}>{challan.studentName}</Text>
                            <Text style={styles.label}>Class</Text>
                            <Text style={styles.value}>{challan.studentClass}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Guardian Name</Text>
                            <Text style={styles.value}>Jehan Zaib</Text>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{challan.date}</Text>
                        </View>
                    </View>
                    <View style={styles.feesection}>
                        <br></br>
                        <hr></hr>
                        <br></br><br></br>
                        <View style={styles.feerow}>
                            <Text style={styles.feelabel}>Monthly Fee</Text>
                            <Text style={styles.feevalue}>Rs.{challan.monthlyFee}</Text>
                        </View>

                        {includePreviousDues && (
                            <View style={styles.feerow}>
                                <Text style={styles.feelabel}>Previous Dues</Text>
                                <Text style={styles.feevalue}>Rs.{challan.previousDues}</Text>
                            </View>
                        )}

                        {includeAdmissionFee && (
                            <View style={styles.feerow}>
                                <Text style={styles.feelabel}>Admission Fee</Text>
                                <Text style={styles.feevalue}>Rs.{challan.admissionFee}</Text>
                            </View>
                        )}

                        <View style={styles.feerow}>
                            <Text style={styles.feelabel}>Late Fee Fine</Text>
                            <Text style={styles.feevalue}>Rs. 100</Text>
                        </View>

                        <View style={styles.feerow}>
                            <Text style={styles.feelabel}>Total Fee till {challan.dueDate}</Text>
                            <Text style={styles.feevalue}>Rs. {challan.totalFee}</Text>
                        </View>

                        {includePreviousDues && (
                            <View style={styles.feerow}>
                                <Text style={styles.feelabel}>
                                    Total Fee after {challan.dueDate} (including Dues)
                                </Text>
                                <Text style={styles.feevalue}>Rs.{challan.totalFee + 100}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};
