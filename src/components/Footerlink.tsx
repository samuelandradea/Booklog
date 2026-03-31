import { Href, Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

type FooterLinkProps = {
    text?: string;
    linkLabel: string;
    href: Href;
}

export function FooterLink({ text, linkLabel, href }: FooterLinkProps) {
    return (
        <Text style={styles.footerText}>
            {text && `${text} `}
            <Link href={href} style={styles.footerLink}>
                {linkLabel}
            </Link>
        </Text>
    )
}

const styles = StyleSheet.create({
    footerText: {
        textAlign: "center",
        color: "#500903",
        fontFamily: "RedHatDisplay_400Regular",
        fontSize: 18,
        marginTop: 5,
    },
    footerLink: {
        color: "#500903",
        fontFamily: "RedHatDisplay_700Bold",
    },
})